import re, json, sys

BASE = "/home/claude/bimport-site"

with open(f"{BASE}/src/index.njk", encoding="utf-8") as f:
    idx = f.read()
with open(f"{BASE}/src/privacy.njk", encoding="utf-8") as f:
    priv = f.read()

def must_replace(text, old, new, expect, label):
    count = text.count(old)
    if count != expect:
        print(f"MISMATCH [{label}]: expected {expect}, found {count}")
        print("---SEARCHED FOR (repr)---")
        print(repr(old[:300]))
        sys.exit(1)
    return text.replace(old, new)

def extract_between(text, start_anchor, end_anchor, label):
    i = text.find(start_anchor)
    if i == -1:
        print(f"ANCHOR NOT FOUND (start) [{label}]: {start_anchor!r}")
        sys.exit(1)
    j = text.find(end_anchor, i)
    if j == -1:
        print(f"ANCHOR NOT FOUND (end) [{label}]: {end_anchor!r}")
        sys.exit(1)
    return text[i:j]

def extract_regex(text, pattern, label):
    m = re.search(pattern, text)
    if not m:
        print(f"REGEX NOT FOUND [{label}]: {pattern}")
        sys.exit(1)
    return m.group(1)

# =========================================================
# 1. Shared blocks (byte-identical in both files) -> includes
# =========================================================
fonts_block = extract_between(idx, '<link rel="preconnect" href="https://fonts.googleapis.com">',
                               '</style>', "fonts-scan")  # just to sanity check region exists
# precise fonts block: the 3 link lines
fonts_block = '\n'.join([
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=Noto+Sans+JP:wght@400;500;700;900&display=swap">',
])
assert idx.count(fonts_block) == 1, "fonts block count mismatch in index"
assert priv.count(fonts_block) == 1, "fonts block count mismatch in privacy"
with open(f"{BASE}/src/_includes/fonts.njk", "w", encoding="utf-8") as f:
    f.write(fonts_block + "\n")
idx = must_replace(idx, fonts_block, '{% include "fonts.njk" %}', 1, "fonts idx")
priv = must_replace(priv, fonts_block, '{% include "fonts.njk" %}', 1, "fonts priv")

def extract_two_scripts(text, start_anchor, label):
    i = text.find(start_anchor)
    if i == -1:
        print(f"ANCHOR NOT FOUND (start) [{label}]: {start_anchor!r}")
        sys.exit(1)
    first_close = text.find("</script>", i)
    second_close = text.find("</script>", first_close + 1)
    if first_close == -1 or second_close == -1:
        print(f"COULD NOT FIND TWO </script> CLOSES [{label}]")
        sys.exit(1)
    end = second_close + len("</script>")
    return text[i:end]

ga4_script = extract_two_scripts(
    idx,
    '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>',
    "ga4-scan",
)
assert idx.count(ga4_script) == 1, "ga4 block count mismatch in index"
assert priv.count(ga4_script) == 1, "ga4 block count mismatch in privacy"
ga4_include = ga4_script.replace("G-XXXXXXXXXX", "{{ site.ga4Id }}")
with open(f"{BASE}/src/_includes/ga4.njk", "w", encoding="utf-8") as f:
    f.write(ga4_include + "\n")
idx = must_replace(idx, ga4_script, '{% include "ga4.njk" %}', 1, "ga4 idx")
priv = must_replace(priv, ga4_script, '{% include "ga4.njk" %}', 1, "ga4 priv")

topbar_block = extract_between(
    idx,
    '<div style="background: #0E0C09; color: #C9A961;',
    '</div>',
    "topbar-scan",
) + "</div>"
assert idx.count(topbar_block) == 1, "topbar block count mismatch in index"
assert priv.count(topbar_block) == 1, "topbar block count mismatch in privacy"
with open(f"{BASE}/src/_includes/topbar.njk", "w", encoding="utf-8") as f:
    f.write(topbar_block + "\n")
idx = must_replace(idx, topbar_block, '{% include "topbar.njk" %}', 1, "topbar idx")
priv = must_replace(priv, topbar_block, '{% include "topbar.njk" %}', 1, "topbar priv")

# =========================================================
# 2. Extract exact values from the file itself (never hand-typed) for site.json
# =========================================================
office_address_display = extract_regex(idx, r'(〒703-8256[^\n<]*?301)', "officeAddressDisplay")
street_address = extract_regex(idx, r'"streetAddress":\s*"([^"]*)"', "streetAddress")
address_locality = extract_regex(idx, r'"addressLocality":\s*"([^"]*)"', "addressLocality")
address_region = extract_regex(idx, r'"addressRegion":\s*"([^"]*)"', "addressRegion")
postal_code = extract_regex(idx, r'"postalCode":\s*"([^"]*)"', "postalCode")
hq_line = extract_between(idx, "本店所在地", "<br>", "hq-line")  # 本店所在地...<br> の直前まで
# hq_line looks like: 本店所在地：東京都世田谷区尾山台1丁目17-11　1F　／　TEL：03-6455-9565
hq_address_display = extract_regex(hq_line, r"：(.*?)　／", "hqAddressDisplay")
license_text = extract_regex(idx, r"古物商許可：([^<\n]*)", "license")

site = {
    "lineUrl": "https://lin.ee/rEjbIrl",
    "phoneDisplay": "086-806-3134",
    "phoneHref": "tel:0868063134",
    "phoneE164": "+81-86-806-3134",
    "faxDisplay": "086-806-3137",
    "mapsUrl": "https://www.google.com/maps/search/?api=1&query=" + address_region + address_locality + street_address.split("　")[0],
    "officeAddressDisplay": office_address_display,
    "officeStreetAddress": street_address,
    "officeLocality": address_locality,
    "officeRegion": address_region,
    "officePostalCode": postal_code,
    "hqAddressDisplay": hq_address_display,
    "hqPhoneDisplay": "03-6455-9565",
    "hqPhoneHref": "tel:0364559565",
    "license": license_text,
    "ga4Id": "G-XXXXXXXXXX",
}

# sanity-check the reconstructed mapsUrl actually matches the real one in the file
real_maps_url = extract_regex(idx, r'href="(https://www\.google\.com/maps/search/[^"]*)"', "mapsUrl-real")
if site["mapsUrl"] != real_maps_url:
    print("MAPS URL MISMATCH")
    print("built   :", repr(site["mapsUrl"]))
    print("in file :", repr(real_maps_url))
    sys.exit(1)

with open(f"{BASE}/src/_data/site.json", "w", encoding="utf-8") as f:
    json.dump(site, f, ensure_ascii=False, indent=2)
    f.write("\n")

# =========================================================
# 3. Substitute literal occurrences in index.njk
# =========================================================
idx = must_replace(idx, 'href="https://lin.ee/rEjbIrl"', 'href="{{ site.lineUrl }}"', 3, "lineUrl idx")
idx = must_replace(idx, 'href="tel:0868063134"', 'href="{{ site.phoneHref }}"', 4, "phoneHref idx")

n_phone_display = idx.count("086-806-3134")
idx = idx.replace("086-806-3134", "{{ site.phoneDisplay }}")

idx = must_replace(idx, '"+81-86-806-3134"', '"{{ site.phoneE164 }}"', 1, "phoneE164 idx")
idx = must_replace(idx, f'href="{real_maps_url}"', 'href="{{ site.mapsUrl }}"', 1, "mapsUrl idx")
idx = must_replace(idx, office_address_display, "〒{{ site.officePostalCode }}　{{ site.officeRegion }}{{ site.officeLocality }}{{ site.officeStreetAddress }}", 1, "officeAddress idx")
idx = must_replace(idx, f'"streetAddress": "{street_address}"', '"streetAddress": "{{ site.officeStreetAddress }}"', 1, "streetAddress idx")
idx = must_replace(idx, f'"addressLocality": "{address_locality}"', '"addressLocality": "{{ site.officeLocality }}"', 1, "addressLocality idx")
idx = must_replace(idx, f'"addressRegion": "{address_region}"', '"addressRegion": "{{ site.officeRegion }}"', 1, "addressRegion idx")
idx = must_replace(idx, f'"postalCode": "{postal_code}"', '"postalCode": "{{ site.officePostalCode }}"', 1, "postalCode idx")
idx = must_replace(idx, hq_line, hq_line.replace(hq_address_display, "{{ site.hqAddressDisplay }}").replace("03-6455-9565", "{{ site.hqPhoneDisplay }}"), 1, "hqLine idx")
idx = must_replace(idx, "086-806-3137", "{{ site.faxDisplay }}", 1, "faxDisplay idx")
idx = must_replace(idx, f"古物商許可：{license_text}", "古物商許可：{{ site.license }}", 1, "license idx")

# =========================================================
# 4. Substitute literal occurrences in privacy.njk
# =========================================================
priv = must_replace(priv, 'href="tel:0364559565"', 'href="{{ site.hqPhoneHref }}"', 1, "hqPhoneHref priv")
priv = must_replace(priv, "03-6455-9565", "{{ site.hqPhoneDisplay }}", 1, "hqPhoneDisplay priv")

# permalink front matter so privacy.njk still builds to privacy.html (not /privacy/index.html)
priv = '---\npermalink: "privacy.html"\n---\n' + priv

with open(f"{BASE}/src/index.njk", "w", encoding="utf-8") as f:
    f.write(idx)
with open(f"{BASE}/src/privacy.njk", "w", encoding="utf-8") as f:
    f.write(priv)

print("phone display occurrences replaced in index:", n_phone_display)
print("site.json values:")
print(json.dumps(site, ensure_ascii=False, indent=2))
print("OK - all substitutions applied without mismatch")
