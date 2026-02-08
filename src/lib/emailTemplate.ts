/**
 * ═══════════════════════════════════════════════════════════
 * EMAIL TEMPLATE — LYRIX OS
 * Dark mode terminal-style HTML email for new lead notifications
 * ═══════════════════════════════════════════════════════════
 */

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  sector: string;
  maintenance: string;
  budget: string;
  cinematic: boolean;
  message: string;
  lang: string;
}

export function buildLeadEmail(data: LeadData): string {
  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC';
  const modules = data.cinematic ? 'Web Architecture + Cinematic Video' : 'Web Architecture';

  const maintenanceLabel: Record<string, string> = {
    managed: 'Managed Mode',
    handover: 'Handover Mode',
    undecided: 'Undecided',
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Lead — Lyrix OS</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Courier New',Courier,monospace;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#111111;border:1px solid #222222;border-radius:12px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#1a1a1a;padding:20px 24px;border-bottom:1px solid #222222;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#FF5F57;margin-right:6px;"></div>
                    <div style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#FEBC2E;margin-right:6px;"></div>
                    <div style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:#28C840;"></div>
                  </td>
                  <td style="text-align:right;">
                    <span style="color:#666666;font-size:11px;letter-spacing:1px;">LYRIX_OS.NOTIFICATION</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- TITLE -->
          <tr>
            <td style="padding:32px 24px 16px;">
              <div style="color:#CCFF00;font-size:10px;letter-spacing:3px;margin-bottom:8px;">■ INCOMING TRANSMISSION</div>
              <div style="color:#EDEDED;font-size:24px;font-weight:bold;letter-spacing:1px;">NEW LEAD CAPTURED</div>
              <div style="color:#666666;font-size:11px;margin-top:8px;">TIMESTAMP: ${timestamp}</div>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:0 24px;">
              <div style="border-top:1px solid #222222;"></div>
            </td>
          </tr>

          <!-- DATA TABLE -->
          <tr>
            <td style="padding:24px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${dataRow('CONTACT', data.name)}
                ${dataRow('EMAIL', data.email)}
                ${dataRow('PHONE', data.phone || '—')}
                ${dataRow('SECTOR', data.sector || '—')}
                ${dataRow('PROTOCOL', maintenanceLabel[data.maintenance] || data.maintenance)}
                ${dataRow('BUDGET', data.budget || '—')}
                ${dataRow('MODULES', modules)}
                ${dataRow('LANGUAGE', data.lang === 'es' ? 'Espanol' : 'English')}
              </table>
            </td>
          </tr>

          <!-- MESSAGE -->
          ${data.message ? `
          <tr>
            <td style="padding:0 24px 24px;">
              <div style="color:#666666;font-size:10px;letter-spacing:2px;margin-bottom:8px;">&gt; MESSAGE</div>
              <div style="background-color:#0a0a0a;border:1px solid #222222;border-radius:8px;padding:16px;">
                <span style="color:#A1A1AA;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</span>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- CINEMATIC FLAG -->
          ${data.cinematic ? `
          <tr>
            <td style="padding:0 24px 24px;">
              <div style="background-color:rgba(204,255,0,0.05);border:1px solid rgba(204,255,0,0.2);border-radius:8px;padding:12px 16px;">
                <span style="color:#CCFF00;font-size:11px;font-weight:bold;letter-spacing:1px;">🎬 CINEMATIC PRODUCTION MODULE REQUESTED</span>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#0a0a0a;padding:20px 24px;border-top:1px solid #222222;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color:#333333;font-size:10px;letter-spacing:1px;">LYRIX OS NOTIFICATION SYSTEM v1.2</span>
                  </td>
                  <td style="text-align:right;">
                    <span style="color:#333333;font-size:10px;letter-spacing:1px;">lyrixdigital.com</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function dataRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #1a1a1a;vertical-align:top;width:120px;">
        <span style="color:#666666;font-size:10px;letter-spacing:2px;">${label}</span>
      </td>
      <td style="padding:8px 0 8px 12px;border-bottom:1px solid #1a1a1a;vertical-align:top;">
        <span style="color:#EDEDED;font-size:13px;">${escapeHtml(value)}</span>
      </td>
    </tr>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
