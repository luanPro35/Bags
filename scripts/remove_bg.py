import os
from PIL import Image
from rembg import remove

def remove_background(input_path, output_path):
    print(f"Processing {input_path} -> {output_path}...")
    with open(input_path, 'rb') as f:
        input_data = f.read()
    output_data = remove(input_data)
    with open(output_path, 'wb') as f:
        f.write(output_data)
    print(f"Saved cutout to {output_path}")

os.makedirs("public/assets", exist_ok=True)

# Process Hero Bag
remove_background("public/assets/hero_bag_noir.jpg", "public/assets/hero_bag_noir_cutout.png")

# Process Shoe
remove_background("public/assets/shoe_sculpted.jpg", "public/assets/shoe_sculpted_cutout.png")

# Also let's cut out Éclat and Rose bags for the collection if needed
remove_background("public/assets/bag_eclat.jpg", "public/assets/bag_eclat_cutout.png")
remove_background("public/assets/bag_rose.jpg", "public/assets/bag_rose_cutout.png")

print("All background removals completed!")
