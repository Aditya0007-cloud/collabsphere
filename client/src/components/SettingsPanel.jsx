import { Building2, Copy, Palette, Plus, ShieldCheck, UserPlus, UsersRound } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPanel({
  workspace,
  workspaces = [],
  user,
  demoMode,
  onSwitchWorkspace,
  onCreateWorkspace,
  onJoinWorkspace,
  onUpdateProfile
}) {
  const [copied, setCopied] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });
  const [inviteCode, setInviteCode] = useState('');
  const [profile, setProfile] = useState({
    name: user.name || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    skills: (user.skills || []).join(', ')
  });

  const submitWorkspace = async (event) => {
    event.preventDefault();
    if (!newWorkspace.name.trim()) return;
    await onCreateWorkspace(newWorkspace);
    setNewWorkspace({ name: '', description: '' });
  };

  const submitInvite = async (event) => {
    event.preventDefault();
    if (!inviteCode.trim()) return;
    await onJoinWorkspace(inviteCode.trim());
    setInviteCode('');
  };

  const submitProfile = async (event) => {
    event.preventDefault();
    await onUpdateProfile({
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar,
      skills: profile.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <section className="view-shell space-y-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Workspace Control</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Create, join, switch, and invite</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <input className="field-light" value={workspace.name} readOnly />
          <textarea className="field-light min-h-28 resize-none" value={workspace.description || ''} readOnly />
          <button
            className="btn-soft"
            onClick={async () => {
              await navigator.clipboard?.writeText(workspace.inviteCode || '');
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied' : workspace.inviteCode}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-bold">Switch Workspace</h3>
          <div className="mt-3 space-y-2">
            {workspaces.map((item) => (
              <button
                key={item._id}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-semibold transition ${item._id === workspace._id ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'}`}
                onClick={() => onSwitchWorkspace(item._id)}
              >
                <span className="truncate">{item.name}</span>
                <span className="text-xs opacity-70">{item.members?.length || 1}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submitWorkspace} className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-bold">Create Workspace</h3>
          <div className="mt-3 space-y-3">
            <input className="field-light" placeholder="Workspace name" value={newWorkspace.name} onChange={(event) => setNewWorkspace({ ...newWorkspace, name: event.target.value })} />
            <input className="field-light" placeholder="Short description" value={newWorkspace.description} onChange={(event) => setNewWorkspace({ ...newWorkspace, description: event.target.value })} />
            <button className="btn-primary w-full">
              <Plus className="h-4 w-4" />
              Create
            </button>
          </div>
        </form>

        <form onSubmit={submitInvite} className="rounded-3xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-bold">Join Workspace</h3>
          <div className="mt-3 flex gap-2">
            <input className="field-light" placeholder={demoMode ? 'Demo mode' : 'Invite code'} value={inviteCode} onChange={(event) => setInviteCode(event.target.value.toUpperCase())} />
            <button className="btn-soft shrink-0">
              <UserPlus className="h-4 w-4" />
              Join
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-5">
        <div className="view-shell">
          <h2 className="text-lg font-bold">Profile</h2>
          <form onSubmit={submitProfile} className="mt-5 grid gap-5 lg:grid-cols-[140px_1fr]">
            <div>
              <img className="h-28 w-28 rounded-3xl object-cover" src={profile.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.name}`} alt={profile.name} />
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Public teammate profile</p>
            </div>
            <div className="space-y-3">
              <input className="field-light" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} placeholder="Name" />
              <input className="field-light" value={profile.avatar} onChange={(event) => setProfile({ ...profile, avatar: event.target.value })} placeholder="Avatar URL" />
              <textarea className="field-light min-h-28 resize-none" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} placeholder="Bio" />
              <input className="field-light" value={profile.skills} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} placeholder="Skills separated by commas" />
              <button className="btn-primary">Save profile</button>
            </div>
          </form>
        </div>

        <div className="view-shell grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"><UsersRound className="mb-3 h-5 w-5 text-cyan-500" />{workspace.members?.length || 0} members</div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"><ShieldCheck className="mb-3 h-5 w-5 text-emerald-500" />JWT secured</div>
          <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"><Palette className="mb-3 h-5 w-5 text-rose-500" />Theme ready</div>
        </div>

        <div className="view-shell">
          <h2 className="text-lg font-bold">Members</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {workspace.members?.map((member) => (
              <div key={member.user?._id || member.user?.id || member.user?.email} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                <img className="h-10 w-10 rounded-xl" src={member.user?.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${member.user?.name}`} alt={member.user?.name} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{member.user?.name}</p>
                  <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
