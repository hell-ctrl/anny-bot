from PIL import Image
import os

input_file_path = "src/temp/media.webp"

output_folder = "src/temp/"

os.makedirs(output_folder, exist_ok = True)

with Image.open(input_file_path) as img:
    try:
        while True:
            current_frame = img.copy()
            current_frame.save(os.path.join(output_folder, f"frame_{img.tell():04d}.png"))
            img.seek(img.tell() + 1)
    except EOFError:
        pass
