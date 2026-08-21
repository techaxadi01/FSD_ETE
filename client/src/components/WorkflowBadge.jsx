import { CheckCircle2, Clock, Cpu, Rocket } from 'lucide-react';

const WorkflowBadge = ({ currentStatus = 'Review', size = 'sm' }) => {
  const steps = [
    { id: 'Review', label: 'Review', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/12 border-amber-400/25 text-amber-600 dark:text-amber-300' },
    { id: 'Approved', label: 'Approved', icon: CheckCircle2, color: 'text-teal-500', bg: 'bg-teal-500/12 border-teal-400/25 text-teal-600 dark:text-teal-300' },
    { id: 'Prototype', label: 'Prototype', icon: Cpu, color: 'text-cyan-500', bg: 'bg-cyan-500/12 border-cyan-400/25 text-cyan-600 dark:text-cyan-300' },
    { id: 'Implemented', label: 'Implemented', icon: Rocket, color: 'text-emerald-500', bg: 'bg-emerald-500/12 border-emerald-400/25 text-emerald-600 dark:text-emerald-300' },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStatus);
  const currentStep = steps[currentIndex] || steps[0];
  const Icon = currentStep.icon;

  if (size === 'pill') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${currentStep.bg}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>Status: {currentStep.label}</span>
      </span>
    );
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Workflow Stage
        </span>
        <span className="font-bold text-emerald-600 dark:text-teal-400 uppercase tracking-wider text-[10px]">
          {currentStep.label}
        </span>
      </div>

      {/* Visual Timeline Bar */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
        {steps.map((step, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              title={`Stage: ${step.label}`}
              className={`flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[10px] font-bold transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 text-white shadow-xs scale-[1.01]'
                  : isPassed
                  ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <StepIcon className="w-3 h-3 shrink-0" />
              <span className="hidden sm:inline truncate">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkflowBadge;
