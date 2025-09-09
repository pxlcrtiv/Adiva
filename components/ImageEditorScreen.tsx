import React, { useState, useCallback, useMemo } from 'react';
import { generateOrEditImage } from '../services/geminiService';
import { LoadingIcon, ImageIcon, XIcon, SparklesIcon, DownloadIcon } from './icons';
import { useAppLoading, useToast } from '../contexts';

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
    const [apiError, setApiError] = useState<string | null>(null);
    const [promptError, setPromptError] = useState('');
    const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);

    const { setIsAppLoading } = useAppLoading();
    const { showToast } = useToast();

    const isPromptValid = useMemo(() => {
        const trimmedPrompt = prompt.trim();
        return trimmedPrompt.length >= 5 && trimmedPrompt.length <= 1000;
    }, [prompt]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setUploadedFiles(prev => [...prev, ...Array.from(event.target.files)]);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `adiva-ai-edited-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Image downloaded!');
    };
    
    const validatePrompt = () => {
        const trimmedPrompt = prompt.trim();
        if (trimmedPrompt.length < 5) {
            setPromptError('Prompt must be at least 5 characters.');
            return false;
        }
        if (trimmedPrompt.length > 1000) {
            setPromptError('Prompt must be 1000 characters or less.');
            return false;
        }
        setPromptError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePrompt()) {
            return;
        }
        setIsLoading(true);
        setIsAppLoading(true);
        setApiError(null);
        setGeneratedResult(null);
        const startTime = Date.now();

        try {
            const imagePayloads = await Promise.all(
                uploadedFiles.map(file => fileToBase64(file))
            );

            const result = await generateOrEditImage(prompt, imagePayloads);
            setGeneratedResult(result);

        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            const elapsedTime = Date.now() - startTime;
            const minLoadingTime = 1000; // 1 second
            const remainingTime = minLoadingTime - elapsedTime;

            setTimeout(() => {
                setIsLoading(false);
                setIsAppLoading(false);
            }, remainingTime > 0 ? remainingTime : 0);
        }
    };

    return (
        <div className="flex flex-col p-4 space-y-6">
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">
                        Upload Images (Optional)
                    </label>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border-color border-dashed rounded-lg cursor-pointer bg-surface hover:bg-secondary dark:border-dark-border-color dark:bg-dark-surface dark:hover:bg-dark-secondary">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon className="w-8 h-8 mb-2 text-text-secondary dark:text-dark-text-secondary" />
                                <p className="mb-1 text-sm text-text-secondary dark:text-dark-text-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">PNG, JPG, GIF</p>
                            </div>
                            <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                </div>

                {uploadedFiles.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Image Previews</h3>
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
                    <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">
                        Prompt
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => {
                            setPrompt(e.target.value);
                            if (promptError) setPromptError('');
                        }}
                        placeholder={uploadedFiles.length > 0 ? "e.g., add a cat wearing a party hat" : "e.g., a photorealistic image of an astronaut riding a horse"}
                        rows={3}
                        className={`w-full rounded-lg border-2 bg-surface p-3 text-text-primary focus:outline-none dark:bg-dark-surface dark:text-dark-text-primary ${
                            promptError ? 'border-red-500 focus:border-red-500' : 'border-border-color focus:border-primary dark:border-dark-border-color'
                        }`}
                    />
                    {promptError && <p className="mt-1 text-sm text-red-500">{promptError}</p>}
                </div>
            </div>

            {apiError && <p className="text-sm text-red-500 text-center">{apiError}</p>}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !isPromptValid}
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
                    <h2 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">Result</h2>
                    <div className="relative group w-full max-w-md">
                        <img src={generatedResult.imageUrl} alt="Generated image" className="rounded-lg w-full h-auto shadow-lg" />
                        <button 
                            onClick={() => handleDownload(generatedResult.imageUrl)}
                            className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Download Image"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    </div>
                    {generatedResult.textResponse && (
                         <p className="text-text-secondary dark:text-dark-text-secondary text-center p-3 bg-surface dark:bg-dark-surface rounded-lg">{generatedResult.textResponse}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageEditorScreen;