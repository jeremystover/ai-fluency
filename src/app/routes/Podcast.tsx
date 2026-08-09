import { Navigate, useParams } from 'react-router-dom';

// Sunset: the full Fluent episode experience lives on the module page now
// (ModuleHub embeds PodcastPanel). This route survives for old links, plans,
// and bookmarks.
export default function Podcast() {
  const moduleId = useParams().moduleId ?? 'ai101-m1';
  return <Navigate to={`/module/${moduleId}`} replace />;
}
