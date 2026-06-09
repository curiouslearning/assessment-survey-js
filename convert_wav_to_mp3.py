import os
import argparse
import subprocess

def convert_wav_to_mp3(input_dir, output_dir=None, bitrate="192k"):
    """
    Converts all .wav files in the input_dir to .mp3 format.
    Uses ffmpeg for high quality compression.
    """
    if output_dir is None:
        output_dir = input_dir
        
    os.makedirs(output_dir, exist_ok=True)
    
    # Check if ffmpeg is installed
    try:
        subprocess.run(["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Error: 'ffmpeg' is not installed or not found in PATH.")
        print("Please install ffmpeg. On Mac, you can run: brew install ffmpeg")
        return

    wav_files = [f for f in os.listdir(input_dir) if f.lower().endswith('.wav')]
    
    if not wav_files:
        print(f"No .wav files found in {input_dir}")
        return
        
    print(f"Found {len(wav_files)} .wav files. Starting conversion...")
    
    for filename in wav_files:
        input_path = os.path.join(input_dir, filename)
        output_filename = os.path.splitext(filename)[0] + ".mp3"
        output_path = os.path.join(output_dir, output_filename)
        
        print(f"Converting {filename} to {output_filename}...")
        
        # ffmpeg command to convert wav to mp3
        # -i: input file
        # -vn: disable video recording (just in case)
        # -ar: audio sampling frequency (44100 Hz is standard CD quality)
        # -ac: number of audio channels (2 for stereo)
        # -b:a: audio bitrate (e.g., 192k for high quality compressed mp3)
        command = [
            "ffmpeg",
            "-y", # Overwrite output files without asking
            "-i", input_path,
            "-vn",
            "-ar", "44100",
            "-ac", "2",
            "-b:a", bitrate,
            output_path
        ]
        
        try:
            subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            print(f"  Successfully converted -> {output_path}")
            # Delete original .wav file
            os.remove(input_path)
            print(f"  Deleted original -> {filename}")
        except subprocess.CalledProcessError as e:
            print(f"  Failed to convert {filename}: {e}")

    print("Conversion process completed!")

if __name__ == "__main__":
    language = input("Enter the language: ")
    assessment_type = input("Enter the type of assessment: ").replace("-", "")
    
    audios_folder = os.path.join("./public/assets/audio", f"{language}-{assessment_type}")
    
    if not os.path.exists(audios_folder):
        print(f"Directory not found: {audios_folder}")
    else:
        print(f"Target folder: {audios_folder}")
        convert_wav_to_mp3(audios_folder, audios_folder, bitrate="192k")
