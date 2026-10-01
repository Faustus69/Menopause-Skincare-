import re

with open("sheet.xlsx", "rb") as f:
    raw = f.read()

strings = re.findall(b"[A-Za-z0-9 ,.;:()/_\\-]{4,}", raw)
print("Total strings found:", len(strings))
matches = [s.decode("latin1") for s in strings if any(k in s.lower() for k in [b"reference", b"clinical", b"evidence", b"study", b"journal", b"doi", b"retinol", b"niacinamide", b"ceramide"])]
print("Sample matches (first 25):")
for m in matches[:25]:
    print(" -", m)
