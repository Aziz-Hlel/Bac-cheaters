import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface TutorialVideoProps {
    onSkip: () => void;
}

const TutorialVideo = ({ onSkip }: TutorialVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleSkip = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onSkip();
    };

    return (
        <div className="flex flex-col items-center justify-between w-full h-full max-h-[calc(100dvh-16rem)] gap-4 py-2" dir="rtl">
            <div className="text-center space-y-1">
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                    دليل توضيحي لعملية الاستيراد
                </h2>
                <p className="text-xs text-muted-foreground">
                    يمكنك مشاهدة الفيديو للتعرف على مراحل استيراد وتعيين البيانات، أو الضغط على تخطي للمتابعة مباشرة
                </p>
            </div>

            <div className="flex-1 min-h-0 flex items-center justify-center w-full">
                <video
                    ref={videoRef}
                    src="/video_tutorial.mp4"
                    controls
                    autoPlay={false}
                    muted={false}
                    playsInline
                    className="max-h-[50vh] h-full w-auto aspect-16/10 object-contain rounded-xl border shadow-sm bg-black"
                >
                    عذراً، متصفحك لا يدعم تشغيل هذا الفيديو.
                </video>
            </div>

            <div className="flex justify-center w-full pt-1">
                <Button
                    type="button"
                    onClick={handleSkip}
                    className="min-w-40 text-base font-semibold"
                >
                    تخطي
                </Button>
            </div>
        </div>
    );
};

export default TutorialVideo;