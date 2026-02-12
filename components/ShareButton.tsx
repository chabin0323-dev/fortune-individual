import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

export const ShareButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (isModalOpen && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, window.location.href, { width: 256, margin: 2 }, (error) => {
                if (error) console.error(error);
            });
        }
    }, [isModalOpen]);

    const handleShareClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('URLをコピーしました！');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('URLのコピーに失敗しました。');
        }
    };

    return (
        <>
            <div className="text-center mt-8">
                <button
                    onClick={handleShareClick}
                    className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 hover:from-emerald-500 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)] transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/20"
                >
                    この占いをシェアする
                </button>
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 animate-fade-in-fast"
                    onClick={handleCloseModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="share-modal-title"
                >
                    <div 
                        className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black rounded-2xl shadow-[0_0_40px_rgba(56,189,248,0.3)] p-6 sm:p-8 border border-white/20 w-full max-w-sm m-4 text-center"
                        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                    >
                        <h3 id="share-modal-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 mb-4">
                            この占いをシェア
                        </h3>
                        <div className="bg-white p-4 rounded-lg inline-block shadow-lg">
                             <canvas ref={canvasRef} />
                        </div>
                        <p className="mt-4 text-indigo-200 text-sm break-all bg-gray-900/50 p-3 rounded-lg border border-white/10">
                            {window.location.href}
                        </p>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                           <button
                                onClick={handleCopyUrl}
                                className="w-full flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/10"
                            >
                                URLをコピー
                            </button>
                             <button
                                onClick={handleCloseModal}
                                className="w-full flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out border border-white/10"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

if (typeof window !== 'undefined') {
    const styleId = 'modal-animation-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @keyframes fadeInFast {
            from { opacity: 0; }
            to { opacity: 1; }
            }
            .animate-fade-in-fast {
            animation: fadeInFast 0.3s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
}