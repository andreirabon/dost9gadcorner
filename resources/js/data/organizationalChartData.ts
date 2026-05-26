/**
 * Hierarchy sourced from public reference tables (`public/gfps.png`, `public/move.png`).
 */
export interface OrgChartNode {
    id: number;
    pid?: number;
    name: string;
    title: string;
}

/** Parent headings whose people are already identified by the group — UI shows name only for children. */
const PARENT_NAMES_CHILD_TITLE_HIDDEN = new Set<string>(['TWG Members', 'Secretariat']);

export function shouldOmitChildTitle(parentName: string | undefined): boolean {
    return parentName !== undefined && PARENT_NAMES_CHILD_TITLE_HIDDEN.has(parentName);
}

/** Node with nested `children` for tree rendering (no `pid` required on output). */
export interface OrgTreeNode extends OrgChartNode {
    children: OrgTreeNode[];
}

/** Flat rows for `d3-org-chart` / d3.stratify (`parentId` null for roots). */
export function toD3OrgChartFlat(nodes: OrgChartNode[]): Array<{
    id: number;
    parentId: number | null;
    name: string;
    title: string;
}> {
    return nodes.map((n) => ({
        id: n.id,
        parentId: n.pid === undefined ? null : n.pid,
        name: n.name,
        title: n.title,
    }));
}

/** Build a forest from flat `id` / `pid` rows (GFPS and MOVE each use self-contained ids). */
export function buildOrgTree(flat: OrgChartNode[]): OrgTreeNode[] {
    const map = new Map<number, OrgTreeNode>();
    for (const row of flat) {
        map.set(row.id, { ...row, children: [] });
    }
    const roots: OrgTreeNode[] = [];
    for (const row of flat) {
        const node = map.get(row.id)!;
        if (row.pid === undefined) {
            roots.push(node);
            continue;
        }
        const parent = map.get(row.pid);
        if (parent) {
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

export function getGfpsNodes(): OrgChartNode[] {
    return [
        { id: 1, name: 'ROSEMARIE S. SALAZAR', title: 'Chairperson' },
        { id: 2, pid: 1, name: 'RICARDO J. APOLINARIO III', title: 'Executive Committee — Chairperson' },
        {
            id: 3,
            pid: 1,
            name: 'JALI J. BADIOLA',
            title: 'Executive Committee — Co-Chairperson; Technical Working Group — Chairperson ',
        },
        { id: 4, pid: 3, name: 'JENNIFER A. PIDOR', title: 'Technical Working Group — Co-Chairperson ' },
        { id: 8, pid: 3, name: 'TWG Members', title: 'Technical Working Group — Members ' },
        { id: 9, pid: 8, name: 'THELMA E. DIEGO', title: 'Member — Technical Working Group ' },
        { id: 10, pid: 8, name: 'GERARDO F. PAROT', title: 'Member — Technical Working Group ' },
        { id: 11, pid: 8, name: 'NUHMAN M. ALJANI', title: 'Member — Technical Working Group ' },
        { id: 12, pid: 8, name: 'INGRID T. ABELLA-COLCOL', title: 'Member — Technical Working Group ' },
        { id: 13, pid: 8, name: 'TEFFANIE MAE C. REYES', title: 'Member — Technical Working Group ' },
        { id: 14, pid: 8, name: 'RONNEL B. GUNDOY', title: 'Member — Technical Working Group ' },
        { id: 15, pid: 8, name: 'JOSEPHINE B. NOHAY', title: 'Member — Technical Working Group ' },
        { id: 16, pid: 8, name: 'JULIUS T. FOJAS', title: 'Member — Technical Working Group ' },
        { id: 17, pid: 8, name: 'JEYZEL P. APARRI-PAQUIT', title: 'Member — Technical Working Group ' },
        { id: 18, pid: 8, name: 'DORES C. GABO', title: 'Member — Technical Working Group ' },
        { id: 19, pid: 8, name: 'JELYN O. BAYONAS', title: 'Member — Technical Working Group ' },
        { id: 20, pid: 8, name: 'HERMA JOYCE T. ALBURO', title: 'Member — Technical Working Group ' },
        { id: 21, pid: 8, name: 'SHERYL F. JOVENAL', title: 'Member — Technical Working Group ' },
        { id: 22, pid: 8, name: 'KRISTINE MAE R. SARITA', title: 'Member — Technical Working Group ' },
        { id: 23, pid: 8, name: 'MARY GRACE ANTONIO-TORRES', title: 'Member — Technical Working Group ' },
        { id: 24, pid: 8, name: 'IAN C. AVENIDO', title: 'Member — Technical Working Group ' },
        { id: 25, pid: 8, name: 'CHRISTIAN CARL R. RESENTE', title: 'Member — Technical Working Group ' },
        { id: 26, pid: 8, name: 'MARC G. CACHIN', title: 'Member — Technical Working Group ' },
        { id: 27, pid: 8, name: 'KIM R. CARUMBA', title: 'Member — Technical Working Group ' },
        { id: 28, pid: 8, name: 'SHARMAINE V. MORALES', title: 'Member — Technical Working Group ' },
        { id: 29, pid: 8, name: 'CHARISA MAE M. BAIT-IT', title: 'Member — Technical Working Group ' },
        { id: 30, pid: 8, name: 'GRETCHEN D. MANANGAN', title: 'Member — Technical Working Group ' },
        { id: 31, pid: 8, name: 'ELLYSSA MAE A. PENDERGAT-BALUCANAG', title: 'Member — Technical Working Group ' },
        { id: 32, pid: 8, name: 'STENEL RIZZA A. GUILLERMO', title: 'Member — Technical Working Group ' },
        { id: 33, pid: 8, name: 'SHEILA S. BERNARDO', title: 'Member — Technical Working Group ' },
        { id: 34, pid: 8, name: 'MA. ELLAINE M. RAYMAN', title: 'Member — Technical Working Group ' },
        { id: 35, pid: 8, name: 'HERSON SANTIAGO S. FERNANDO Jr.', title: 'Member — Technical Working Group ' },
        { id: 5, pid: 3, name: 'Secretariat', title: 'Technical Working Group — Secretariat' },
        { id: 6, pid: 5, name: 'MARIEFER T. UTAL', title: 'Secretariat ' },
        { id: 7, pid: 5, name: 'AUBREY A. AMPARO', title: 'Secretariat ' },
    ];
}

export function getMoveNodes(): OrgChartNode[] {
    return [
        { id: 1, name: 'RONNEL B. GUNDOY', title: 'Chairperson' },
        { id: 2, pid: 1, name: 'JULIUS T. FOJAS', title: 'Co-Chairperson' },
        /* Under Co-Chair: Focal Persons first, then Secretariat (array order defines child order in tree). */
        { id: 3, pid: 2, name: 'IAN C. AVENIDO', title: 'Focal Person ' },
        { id: 4, pid: 2, name: 'ROGER DAVE F. GRAMATICA', title: 'Focal Person ' },
        { id: 5, pid: 2, name: 'CHRISTIAN CARL R. RESENTE', title: 'Focal Person ' },
        { id: 6, pid: 2, name: 'MARC G. CACHIN', title: 'Focal Person ' },
        { id: 7, pid: 2, name: 'KIM R. CARUMBA', title: 'Focal Person ' },
        { id: 8, pid: 2, name: 'Secretariat', title: 'Secretariat' },
        { id: 9, pid: 8, name: 'HERSON SANTIAGO S. FERNANDO Jr.', title: 'Secretariat' },
        { id: 10, pid: 8, name: 'CRIS-ANGELO B. PRIETO', title: 'Secretariat' },
        { id: 11, pid: 8, name: 'KYLE ANGELO G. ADAS', title: 'Secretariat' },
    ];
}
