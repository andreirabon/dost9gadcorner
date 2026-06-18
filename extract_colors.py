import os
import re

color_pattern = re.compile(r'(#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\([^)]+\)|hsla?\([^)]+\))')

colors = set()
directories = ['resources/css', 'resources/js']

for directory in directories:
    for root, dirs, files in os.walk(directory):
        for f in files:
            if f.endswith('.vue') or f.endswith('.css'):
                with open(os.path.join(root, f), 'r', encoding='utf-8') as file:
                    try:
                        content = file.read()
                        matches = color_pattern.findall(content)
                        for match in matches:
                            # Basic cleanup
                            match = match.strip().replace('\n', ' ').replace('\r', '')
                            match = re.sub(r'\s+', ' ', match)
                            colors.add(match)
                    except Exception as e:
                        print(f"Error reading {f}: {e}")

for c in sorted(colors):
    print(c)
