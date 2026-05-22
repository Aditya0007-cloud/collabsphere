import { Download, FileText, ImageIcon, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import EmptyState from './EmptyState';
import { bytesToSize, formatDate } from '../utils/format';

export default function FileHub({ files, onUploadFile }) {
  const [link, setLink] = useState('');

  const submitLink = (event) => {
    event.preventDefault();
    if (!link.trim()) return;
    onUploadFile({ originalName: link.split('/').pop() || 'Shared link', url: link, mimeType: 'text/uri-list' });
    setLink('');
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="view-shell">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
          <UploadCloud className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-xl font-bold">File Sharing</h2>
        <form onSubmit={submitLink} className="mt-5 space-y-3">
          <input className="field-light" value={link} onChange={(event) => setLink(event.target.value)} placeholder="Paste file or document URL" />
          <button className="btn-primary w-full">
            <LinkIcon className="h-4 w-4" />
            Share link
          </button>
        </form>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 p-8 text-center transition hover:border-cyan-400 dark:border-white/15 dark:bg-white/5">
          <UploadCloud className="h-8 w-8 text-slate-400" />
          <span className="mt-3 text-sm font-semibold">Upload image or document</span>
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUploadFile({ file });
            }}
          />
        </label>
      </section>

      <section className="view-shell">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-bold">Shared Assets</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{files.length} files available to the team</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {files.length === 0 && <div className="md:col-span-2 xl:col-span-3"><EmptyState icon={UploadCloud} title="No files shared yet" body="Upload a document, image, spec, spreadsheet, or paste an external file link." /></div>}
          {files.map((file) => (
            <article key={file._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="grid aspect-video place-items-center bg-slate-100 dark:bg-white/5">
                {file.previewType === 'image' && file.url && file.url !== '#' ? (
                  <img src={file.url} alt={file.originalName} className="h-full w-full object-cover" />
                ) : file.previewType === 'document' ? (
                  <FileText className="h-12 w-12 text-rose-400" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-cyan-400" />
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate font-bold">{file.originalName}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{bytesToSize(file.size)} • {formatDate(file.createdAt)}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img className="h-8 w-8 rounded-xl" src={file.uploadedBy?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${file.uploadedBy?.name}`} alt={file.uploadedBy?.name} />
                    <span className="text-sm font-semibold">{file.uploadedBy?.name}</span>
                  </div>
                  <a className="icon-btn" href={file.url} download aria-label="Download file">
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
