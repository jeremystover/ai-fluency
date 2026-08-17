import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './brand';
import { Header, Footer } from './components/ui';
import Landing from './routes/Landing';
import Enter from './routes/Enter';
import Reset from './routes/Reset';
import Welcome from './routes/Welcome';
import Plan from './routes/Plan';
import Diagnostic from './routes/Diagnostic';
import DiagnosticResult from './routes/DiagnosticResult';
import Path from './routes/Path';
import Library from './routes/Library';
import Record from './routes/Record';
import Team from './routes/Team';
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

// `fullCourseOnly` marks the screens a short course doesn't have: the path
// screen and the library. Short-course learners get one view of their course
// — the plan — so those routes land there instead of 404-ing or showing a
// catalog they weren't given.
//
// `afterDiagnostic` marks the screens that wait behind a short course's
// diagnostic. When the short course defines one it is required, not offered:
// intake → diagnostic → plan, and typing a URL doesn't skip the middle.
function RequireSession({
  children,
  fullCourseOnly = false,
  afterDiagnostic = false,
}: {
  children: ReactNode;
  fullCourseOnly?: boolean;
  afterDiagnostic?: boolean;
}) {
  const { me } = useApp();
  const location = useLocation();
  if (me === null) return <div className="min-h-[50vh]" aria-busy="true" />;
  if (!me.authenticated) return <Navigate to="/enter" replace state={{ from: location.pathname }} />;
  const short = me.shortCourse;
  if (short && fullCourseOnly) return <Navigate to="/plan" replace />;
  if (short?.hasDiagnostic && afterDiagnostic && me.progress.intakeDone && !me.progress.diagnosticDone) {
    return <Navigate to="/diagnostic" replace />;
  }
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
          <Route path="/reset" element={<Reset />} />
          <Route path="/welcome" element={<RequireSession><Welcome /></RequireSession>} />
          <Route path="/plan" element={<RequireSession afterDiagnostic><Plan /></RequireSession>} />
          <Route path="/hello" element={<Navigate to="/welcome" replace />} />
          <Route path="/diagnostic" element={<RequireSession><Diagnostic /></RequireSession>} />
          <Route path="/diagnostic/result" element={<RequireSession><DiagnosticResult /></RequireSession>} />
          <Route path="/path" element={<RequireSession fullCourseOnly><Path /></RequireSession>} />
          <Route path="/library" element={<RequireSession fullCourseOnly><Library /></RequireSession>} />
          <Route path="/record" element={<RequireSession><Record /></RequireSession>} />
          <Route path="/team" element={<RequireSession><Team /></RequireSession>} />
          {/* Legacy /module/1 links (plans, bookmarks) → the canonical module id. */}
          <Route path="/module/1" element={<Navigate to="/module/ai101-m1" replace />} />
          <Route path="/module/1/chat" element={<Navigate to="/module/ai101-m1/chat" replace />} />
          <Route path="/module/1/micro" element={<Navigate to="/module/ai101-m1/micro" replace />} />
          <Route path="/module/1/podcast" element={<Navigate to="/module/ai101-m1/podcast" replace />} />
          <Route path="/module/1/activity" element={<Navigate to="/module/ai101-m1/activity" replace />} />
          <Route path="/module/1/complete" element={<Navigate to="/module/ai101-m1/complete" replace />} />
          <Route path="/module/:moduleId" element={<RequireSession afterDiagnostic><ModuleView /></RequireSession>} />
          <Route path="/module/:moduleId/chat" element={<RequireSession afterDiagnostic><Chat /></RequireSession>} />
          <Route path="/module/:moduleId/micro" element={<RequireSession afterDiagnostic><MicroView /></RequireSession>} />
          <Route path="/module/:moduleId/podcast" element={<RequireSession afterDiagnostic><Podcast /></RequireSession>} />
          <Route path="/module/:moduleId/activity" element={<RequireSession afterDiagnostic><Activity /></RequireSession>} />
          <Route path="/module/:moduleId/check" element={<RequireSession afterDiagnostic><KnowledgeCheck /></RequireSession>} />
          <Route path="/module/:moduleId/complete" element={<RequireSession afterDiagnostic><Complete /></RequireSession>} />
          <Route path="/mcp" element={<RequireSession><McpSetup /></RequireSession>} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
