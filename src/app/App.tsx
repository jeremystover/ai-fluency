import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './brand';
import { Header, Footer } from './components/ui';
import Landing from './routes/Landing';
import Enter from './routes/Enter';
import Welcome from './routes/Welcome';
import Plan from './routes/Plan';
import Diagnostic from './routes/Diagnostic';
import DiagnosticResult from './routes/DiagnosticResult';
import Path from './routes/Path';
import Library from './routes/Library';
import ModuleView from './routes/ModuleView';
import Chat from './routes/Chat';
import MicroView from './routes/MicroView';
import Podcast from './routes/Podcast';
import Admin from './routes/Admin';
import McpSetup from './routes/McpSetup';
import KnowledgeCheck from './routes/KnowledgeCheck';
import Activity from './routes/Activity';
import Complete from './routes/Complete';
import type { ReactNode } from 'react';

function RequireSession({ children }: { children: ReactNode }) {
  const { me } = useApp();
  const location = useLocation();
  if (me === null) return <div className="min-h-[50vh]" aria-busy="true" />;
  if (!me.authenticated) return <Navigate to="/enter" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/enter" element={<Enter />} />
          <Route path="/welcome" element={<RequireSession><Welcome /></RequireSession>} />
          <Route path="/plan" element={<RequireSession><Plan /></RequireSession>} />
          <Route path="/hello" element={<Navigate to="/welcome" replace />} />
          <Route path="/diagnostic" element={<RequireSession><Diagnostic /></RequireSession>} />
          <Route path="/diagnostic/result" element={<RequireSession><DiagnosticResult /></RequireSession>} />
          <Route path="/path" element={<RequireSession><Path /></RequireSession>} />
          <Route path="/library" element={<RequireSession><Library /></RequireSession>} />
          {/* Legacy /module/1 links (plans, bookmarks) → the canonical module id. */}
          <Route path="/module/1" element={<Navigate to="/module/ai101-m1" replace />} />
          <Route path="/module/1/chat" element={<Navigate to="/module/ai101-m1/chat" replace />} />
          <Route path="/module/1/micro" element={<Navigate to="/module/ai101-m1/micro" replace />} />
          <Route path="/module/1/podcast" element={<Navigate to="/module/ai101-m1/podcast" replace />} />
          <Route path="/module/1/activity" element={<Navigate to="/module/ai101-m1/activity" replace />} />
          <Route path="/module/1/complete" element={<Navigate to="/module/ai101-m1/complete" replace />} />
          <Route path="/module/:moduleId" element={<RequireSession><ModuleView /></RequireSession>} />
          <Route path="/module/:moduleId/chat" element={<RequireSession><Chat /></RequireSession>} />
          <Route path="/module/:moduleId/micro" element={<RequireSession><MicroView /></RequireSession>} />
          <Route path="/module/:moduleId/podcast" element={<RequireSession><Podcast /></RequireSession>} />
          <Route path="/module/:moduleId/activity" element={<RequireSession><Activity /></RequireSession>} />
          <Route path="/module/:moduleId/check" element={<RequireSession><KnowledgeCheck /></RequireSession>} />
          <Route path="/module/:moduleId/complete" element={<RequireSession><Complete /></RequireSession>} />
          <Route path="/mcp" element={<RequireSession><McpSetup /></RequireSession>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
