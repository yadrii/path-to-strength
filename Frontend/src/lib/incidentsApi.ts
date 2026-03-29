import { getMainApiBase } from '@/lib/apiBase';
import { getTokenFromStorage } from '@/lib/restorationApi';

export interface IncidentDto {
  id: string;
  incident_type: string;
  description: string;
  priority: string;
  anonymous_to_ngo: boolean;
  created_at: number;
  status: 'pending' | 'resolved';
  resolved_at: number | null;
  assigned_to: string | null;
  assigned_unit: string | null;
  progress_state: string;
  progress_updated_at: number | null;
  reporter_display_name?: string | null;
  reporter_kind?: 'anonymous' | 'registered' | null;
}

export interface IncidentStatsDto {
  pending_cases: number;
  resolved_cases: number;
  pending_anonymous: number;
  pending_registered: number;
  incidents_this_week: number;
}

async function readError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { detail?: unknown };
    const d = j.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d))
      return d
        .map((x: { msg?: string }) => x.msg ?? '')
        .filter(Boolean)
        .join(', ');
    return 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export async function fetchIncidents(
  token: string,
  filterKind: 'all' | 'anonymous' | 'registered' = 'all',
  caseStatus: 'all' | 'pending' | 'resolved' = 'all',
): Promise<IncidentDto[]> {
  const base = getMainApiBase();
  const params = new URLSearchParams();
  if (filterKind !== 'all') params.set('filter_kind', filterKind);
  if (caseStatus !== 'all') params.set('case_status', caseStatus);
  const q = params.toString();
  const res = await fetch(`${base}/api/incidents${q ? `?${q}` : ''}`, {
    headers: { Authorization: 'Bearer ' + token },
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as IncidentDto[];
}

export async function fetchIncidentStats(token: string): Promise<IncidentStatsDto> {
  const base = getMainApiBase();
  const res = await fetch(`${base}/api/incidents/stats`, {
    headers: { Authorization: 'Bearer ' + token },
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as IncidentStatsDto;
}

export async function createIncident(
  token: string,
  body: {
    incident_type: string;
    description: string;
    priority?: 'low' | 'medium' | 'high';
    anonymous_to_ngo?: boolean;
  },
): Promise<IncidentDto> {
  const base = getMainApiBase();
  const res = await fetch(`${base}/api/incidents`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as IncidentDto;
}

export async function updateIncidentStatus(
  token: string,
  incidentId: string,
  status: 'pending' | 'resolved',
): Promise<IncidentDto> {
  const base = getMainApiBase();
  const res = await fetch(`${base}/api/incidents/${encodeURIComponent(incidentId)}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as IncidentDto;
}

export async function updateIncidentWorkflow(
  token: string,
  incidentId: string,
  body: {
    assigned_to?: string | null;
    assigned_unit?: string | null;
    progress_state?: string;
  },
): Promise<IncidentDto> {
  const base = getMainApiBase();
  const res = await fetch(`${base}/api/incidents/${encodeURIComponent(incidentId)}/workflow`, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as IncidentDto;
}

export { getTokenFromStorage };
