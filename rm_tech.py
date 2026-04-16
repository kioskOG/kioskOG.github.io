import sys

file_path = "/Users/opstree/Documents/github.io/kioskOG.github.io/_layouts/full-bleed.html"

with open(file_path, "r") as f:
    lines = f.readlines()

# delete 1879 to 1949 (0-indexed 1878 to 1949)
# wait, instead of hardcoded numbers, filter out the TECHE ECOSYSTEM block
start_idx = -1
end_idx = -1

for i, line in enumerate(lines):
    if "<!-- TECH ECOSYSTEM -->" in line:
        start_idx = i
        # also remove the divider above if it's there
        if "divider" in lines[i-2]:
            start_idx = i - 2
    if start_idx != -1 and i > start_idx:
        if "<!-- PROJECTS -->" in line:
            end_idx = i
            # also want to leave the divider right above PROJECTS so let's stop at the line before it or something
            break

if start_idx != -1 and end_idx != -1:
    # go backwards from end_idx to find the `</section>` of tech ecosystem
    for j in range(end_idx - 1, start_idx, -1):
        if "</section>" in lines[j]:
            end_idx = j + 2 # include the newline after
            break

    del lines[start_idx:end_idx]
    
    with open(file_path, "w") as f:
        f.writelines(lines)
    print("Section removed successfully")
else:
    print("Could not find section")
