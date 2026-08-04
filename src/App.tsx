import DataTableLayout from "./features/students/components/data-table-layout";




export default function App() {
  return (
    <main className="min-h-screen w-full px-4 py-6 md:px-8">
      <header className="rounded-3xl w-full border border-white/10 bg-slate-900/70 p-6 shadow-glow backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">سجلات الطلاب</p>
        <h1 className="mt-2 text-3xl font-semibold">إدارة الطلاب ببساطة</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          أضف الطلاب وعدلهم واحذفهم واطلع على البيانات وفلترها ورتبها. يتم حفظ كل شيء محليًا داخل
          `lowdb`.
        </p>
      </header>
      <DataTableLayout />

    </main>
  );
}
