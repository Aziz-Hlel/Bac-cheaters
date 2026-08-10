import DataTableLayout from "./features/students/components/data-table-layout";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useStudents } from '@/features/students/hooks/useStudents';
import { useMemo } from 'react';

function StatCard({ label, value, icon, accent }: { label: string; value: number | string; icon: string; accent?: string }) {
  return (
    <Card className="flex-1 min-w-32.5 border-border/60 bg-card/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-4 flex flex-col gap-1">
        <span className={`text-2xl leading-none ${accent ?? 'text-primary'}`}>{icon}</span>
        <span className="text-2xl font-bold tabular-nums tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground leading-tight">{label}</span>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const { students } = useStudents();

  const stats = useMemo(() => {
    const total = students.length;
    const years = new Set(students.map((s) => s.schoolYear)).size;

    let expired = 0;
    let active = 0;
    for (const s of students) {
      const schoolYear = s.schoolYear ?? null;
      const punishmentDuration = s.punishmentDuration ?? null;
      if (schoolYear == null || punishmentDuration == null) continue;
      const punishmentEndYear = schoolYear + punishmentDuration;
      const aligeableDate = new Date(`${punishmentEndYear - 1}-07-01`);
      const isPunishmentPassed = new Date().getTime() - aligeableDate.getTime() > 0;
      if (isPunishmentPassed) expired++;
      else active++;
    }

    return { total, years, expired, active };
  }, [students]);

  return (
    <main className="min-h-screen w-full px-4 py-6 md:px-8 space-y-4">

      {/* ─── Hero Header ─────────────────────────────────────────────────── */}
      <header className="rounded-2xl w-full border border-border/50 bg-card/60 backdrop-blur-md shadow-md overflow-hidden">

        {/* Top accent bar */}
        <div className="h-1 w-full bg-linear-to-r from-primary via-accent to-secondary" />

        <div className="p-6 md:p-8 space-y-5">

          {/* Title row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-[10px] tracking-widest uppercase font-semibold border-primary/40 text-primary bg-primary/8">
                  المندوبية الجهوية للتربية بسوسة
                </Badge>
                <Badge variant="outline" className="text-[10px] tracking-widest uppercase font-semibold border-destructive/40 text-destructive bg-destructive/8">
                  سجل الغش
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug" dir="rtl">
                سجل الطلاب المخالفين في امتحان البكالوريا
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed" dir="rtl">
                قاعدة بيانات محلية لإدارة ملفات الغش والمخالفات الامتحانية — بما فيها التحقيق، المندوبية، الشعبة، وسنة الاجتياز.
              </p>
            </div>

            {/* Shield icon area */}
            <div className="shrink-0 flex items-center justify-center w-16 h-16 rounded-xl bg-destructive/10 border border-destructive/20 text-3xl select-none">
              🛡️
            </div>
          </div>

          <Separator className="opacity-50" />

          {/* Stats row */}
          <div className="flex flex-wrap gap-3">
            <StatCard icon="📋" label="إجمالي المخالفين" value={stats.total} />
            <StatCard icon="📅" label="دورات مسجّلة" value={stats.years} accent="text-accent" />
            <StatCard icon="✅" label="انتهت عقوبتهم" value={stats.expired} accent="text-green-500" />
            <StatCard icon="🔴" label="العقوبة سارية" value={stats.active} accent="text-destructive" />
          </div>

        </div>
      </header>

      {/* ─── Data Table ──────────────────────────────────────────────────── */}
      <Card>
        <CardContent>

          <DataTableLayout />
        </CardContent>
      </Card>

    </main>
  );
}

