import glob
for f in glob.glob('/Users/apple/Desktop/Weighbridge_front_end/*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    if r"openLightbox(\'" in content:
        content = content.replace(r"openLightbox(\'", "openLightbox('")
        content = content.replace(r"\', \'", "', '")
        content = content.replace(r"\')", "')")
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed quotes in {f}")
