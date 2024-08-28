import os
import json

def construct_json_path(root_folder, language,assessment_type):
    json_path = os.path.join(root_folder, f"{language}-{assessment_type}.json")
    return json_path

def get_distinct_item_names(json_path):
    try:
        with open(json_path, "r", encoding="utf8") as json_file:
            data = json.load(json_file)
            
            distinct_items = set()
            
            # Traverse through the JSON data to find distinct item names
            if "buckets" in data:
                for bucket in data["buckets"]:
                    for item in bucket["items"]:
                        distinct_items.add(item["itemName"].lower())
            
            return list(distinct_items)
    except Exception as e:
        print("Error extracting distinct item names:", e)
        return []

def check_audio_files(audios_folder, distinct_items):
    missing_audios = []
    
    for item in distinct_items:
        audio_file = f"{item}.mp3"  # Assuming audio files have .mp3 extension
        audio_path = os.path.join(audios_folder, audio_file.lower())
        
        if not os.path.exists(audio_path):
            missing_audios.append(audio_file)
    
    if missing_audios:
        print("Missing audio files:")
        for audio in missing_audios:
            print(audio)
    else:
        print("All audio files are present.")

if __name__ == "__main__":
    root_folder = r"./data"
    
    language = input("Enter the language: ")
    assessment_type=input("Enter the type of assessment")
    json_path = construct_json_path(root_folder, language,assessment_type)
    audios_folder = os.path.join("./audio", f"{language}-{assessment_type}")
    print("Constructed JSON path:", json_path)
    
    # Get distinct items from JSON data
    distinct_items = get_distinct_item_names(json_path)
    print("Distinct item names:", distinct_items)
    
    # Check if the corresponding audio files exist in the audio folder
    check_audio_files(audios_folder, distinct_items)
