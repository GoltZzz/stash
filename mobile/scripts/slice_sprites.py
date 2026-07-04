import os
from PIL import Image

def slice_sheet(img_path, cols, rows, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(img_path).convert('RGBA')
    w, h = img.size
    cw = w // cols
    ch = h // rows
    
    print(f'Slicing {img_path} ({w}x{h}) into {cols}x{rows} frames of size {cw}x{ch}...')
    
    for r in range(rows):
        for c in range(cols):
            box = (c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)
            frame = img.crop(box)
            
            # Check if frame is empty (all pixels have alpha=0)
            is_empty = True
            for x in range(cw):
                for y in range(ch):
                    if frame.getpixel((x, y))[3] > 0:
                        is_empty = False
                        break
                if not is_empty:
                    break
            
            if not is_empty:
                frame_name = f'frame_{r}_{c}.png'
                frame.save(os.path.join(output_dir, frame_name))
                # print(f'  Saved {frame_name}')

base_output = '/Users/golti/.gemini/antigravity/brain/64703e0c-b32f-4a9f-ba49-65fa7433bfc9/scratch'
slice_sheet('assets/images/fg/fg-walking.png', 4, 4, os.path.join(base_output, 'walking_4x4'))
slice_sheet('assets/images/fg/fg-idle.png', 4, 4, os.path.join(base_output, 'idle_4x4'))
slice_sheet('assets/images/fg/fg-walking.png', 3, 4, os.path.join(base_output, 'walking_3x4'))
slice_sheet('assets/images/fg/fg-idle.png', 3, 4, os.path.join(base_output, 'idle_3x4'))
print('Done slicing!')
