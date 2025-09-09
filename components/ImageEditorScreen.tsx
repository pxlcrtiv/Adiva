
import React, { useState, useCallback } from 'react';
import { generateOrEditImage } from '../services/geminiService';
import { LoadingIcon, ImageIcon, XIcon, SparklesIcon } from './icons';

interface GeneratedResult {
    imageUrl: string;
    textResponse?: string;
}

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // "data:image/jpeg;base64,...."
            const parts = result.split(',');
            const mimeType = parts[0].split(':')[1].split(';')[0];
            const data = parts[1];
            resolve({ mimeType, data });
        };
        reader.onerror = (error) => reject(error);
    });
};

const ImageEditorScreen: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUploadedFiles(prev => [...prev, ...Array.from(event.target.files)]);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError('Please enter a prompt to generate or edit an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedResult(null);

        try {
            const imagePayloads = await Promise.all(
                uploadedFiles.map(file => fileToBase64(file))
            );

            const result = await generateOrEditImage(prompt, imagePayloads);
            setGeneratedResult(result);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col p-4 space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-text-secondary mb-2">
                        Upload Images (Optional)
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-surface hover:bg-secondary">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon className="w-8 h-8 mb-2 text-text-secondary" />
                                <p className="mb-1 text-sm text-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-text-secondary">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {uploadedFiles.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary mb-2">Image Previews</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {uploadedFiles.map((file, index) => (
                                <div key={index} className="relative">
                                    <img src={URL.createObjectURL(file)} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                                    <button onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 text-white">
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary mb-1">
                        Prompt
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={uploadedFiles.length > 0 ? "e.g., add a cat wearing a party hat" : "e.g., a photorealistic image of an astronaut riding a horse"}
                        rows={3}
                        className="w-full rounded-lg border-2 border-secondary bg-surface p-3 text-text-primary focus:border-primary focus:outline-none"
                    />
                </div>
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !prompt}
                className="flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
                {isLoading ? (
                    <>
                        <LoadingIcon className="h-5 w-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="h-5 w-5" />
                        {uploadedFiles.length > 0 ? 'Edit Image' : 'Generate Image'}
                    </>
                )}
            </button>

            {generatedResult && (
                <div className="mt-4 flex flex-col items-center gap-4 animate-fade-in">
                    <h2 className="text-lg font-bold text-text-primary">Result</h2>
                    <img src={generatedResult.imageUrl} alt="Generated image" className="rounded-lg max-w-full h-auto shadow-lg" />
                    {generatedResult.textResponse && (
                         <p className="text-text-secondary text-center p-3 bg-surface rounded-lg">{generatedResult.textResponse}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageEditorScreen;
