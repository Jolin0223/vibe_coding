// ProcessFlow.tsx
import { ArrowRight } from "lucide-react";
import Image from 'next/image';

export default function ProcessFlow() {
  const steps = [
    {
      id: 1,
      title: "1. 灵感",
      subtitle: "(Inspiration)",
      icon: "/__3746_1x-103f8e7a-e9a4-46de-a405-da865832a12d.png",
    },
    {
      id: 2,
      title: "2. Vibe Coding",
      subtitle: "(HTML生成)",
      icon: "/__3748_1x-8babfbd0-9a9a-4b8b-94c5-f621643c89d6.png",
    },
    {
      id: 3,
      title: "3. MasterGo编辑",
      subtitle: "(HTML转SVG)",
      icon: "/__3752_1x-2630139f-5816-4d03-9b16-51cba0c25e6d.png",
    },
    {
      id: 4,
      title: "4. 调整DEMO",
      subtitle: "(原型输入验证)",
      icon: "/__3751_1x-71cc46b3-e751-4784-ade8-aee418ad53ee.png",
    },
    {
      id: 5,
      title: "5. 反向生成PRD",
      subtitle: "(AI-Generated PRD)",
      icon: "/__3755_1x-1d8ac28d-7070-4369-a833-e624d80981fc.png",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mb-8 overflow-x-auto pb-4 scrollbar-hide">
      {/* Container: Fixed width 1145px, Height 180px */}
      <div className="relative min-w-[1145px] w-[1145px] h-[180px] mx-auto">
        
        {/* Background Rectangle (Group 3756 Background) */}
        <div className="absolute inset-0 rounded-[24px] border border-white/80"
             style={{
                 background: 'rgba(255, 255, 255, 0.5)',
                 borderColor: 'rgba(255, 255, 255, 0.8)'
             }}
        ></div>

        {/* Content Flex Container */}
        <div className="relative h-full flex items-center px-[29px]">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                    {/* Card (Group 4751, etc.) */}
                    <div 
                        className="w-[160px] h-[110px] rounded-[16px] border-[1.5px] border-white flex flex-col items-center justify-center gap-2 transition-transform hover:scale-105 hover:shadow-lg relative z-10"
                        style={{
                            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
                            boxShadow: '0px 0.69px 1.03px -0.69px rgba(0, 0, 0, 0.1), 0px 1.72px 2.57px -0.51px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {/* Icon Circle (Group 3746, etc.) */}
                        <div className="w-[48px] h-[48px] flex items-center justify-center mt-[-10px] relative">
                           <Image src={step.icon} alt={step.title} width={48} height={48} className="object-contain" />
                        </div>
                        
                        {/* Text */}
                        <div className="text-center">
                            <div className="text-[15px] font-medium text-[#1E293B] leading-tight mb-1">{step.title}</div>
                            <div className="text-[12px] text-[#64748B] leading-tight">{step.subtitle}</div>
                        </div>
                    </div>
                    
                    {/* Connecting Line (Path 4808, etc.) */}
                    {index < steps.length - 1 && (
                        <div className="flex items-center justify-center w-[69px]">
                             <div 
                                className="w-[40px] h-[3px] rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #93C5FD 0%, #3B82F6 100%)'
                                }}
                             ></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
