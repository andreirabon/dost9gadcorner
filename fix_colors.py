import os
import re

files = [
    r'resources/js/pages/reports/Index.vue',
    r'resources/js/pages/reports/Create.vue',
    r'resources/js/pages/reports/Edit.vue',
    r'resources/js/pages/reports/Show.vue'
]

replacements = [
    (r'\bbg-white text-slate-900\b', 'bg-[#0e0716] text-purple-50'),
    (r'\btext-slate-900\b', 'text-purple-50'),
    (r'\btext-slate-800\b', 'text-purple-100'),
    (r'\btext-slate-700\b', 'text-purple-100'),
    (r'\btext-slate-600\b', 'text-purple-200/70'),
    (r'\btext-slate-500\b', 'text-purple-200/70'),
    (r'\btext-slate-400\b', 'text-purple-300/50'),
    
    (r'\bborder-slate-200\b', 'border-white/10'),
    (r'\bborder-slate-300\b', 'border-white/20'),
    
    (r'\bbg-slate-50\b', 'bg-black/20'),
    (r'\bbg-slate-100\b', 'bg-white/5'),
    (r'\bbg-slate-200\b', 'bg-white/10'),
    
    (r'\bhover:bg-slate-50\b', 'hover:bg-white/5'),
    (r'\bhover:bg-slate-100\b', 'hover:bg-white/10'),
    (r'\bhover:border-slate-300\b', 'hover:border-white/20'),
    (r'\bhover:text-slate-900\b', 'hover:text-purple-50'),
    (r'\bhover:text-slate-800\b', 'hover:text-purple-100'),
    
    (r'\bbg-white\b', 'bg-[#0e0716]'),
    (r'\bbg-white/\[0\.02\]\b', 'bg-white/5'),
    
    # Specific component tweaks
    (r'content-class=".*?bg-\[#0e0716\].*?"', 'content-class="flex min-h-0 flex-1 flex-col bg-[#0e0716] text-purple-50 selection:bg-violet-500/30"'),
    (r'bg-\[#0e0716\] border-white/10 text-purple-50 shadow', 'bg-purple-900/20 border-white/10 text-purple-50 shadow'),
]

for filepath in files:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for old, new in replacements:
        content = re.sub(old, new, content)
        
    # Manual fixes for cards and dialogs
    content = content.replace('bg-[#0e0716] px-4 py-20', 'bg-purple-900/20 px-4 py-20')
    content = content.replace('bg-[#0e0716] shadow-sm overflow-hidden', 'bg-purple-900/20 shadow-sm overflow-hidden')
    content = content.replace('bg-[#0e0716] border-white/10 text-purple-50 shadow-\[0_20px_40px_-15px_rgba\(0,0,0,0\.7\)\]', 'bg-[#0e0716] border-white/10 text-purple-50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)]')
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")
