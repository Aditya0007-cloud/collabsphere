import { motion } from 'framer-motion';

export default function MetricCard({ title, value, icon: Icon, accent, detail }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="surface rounded-3xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950 dark:text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accent}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
