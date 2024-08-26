import os
import json

def construct_json_path(root_folder, language, assessment_type):
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

def find_audios_in_folder(audios_folder):
    try:
        # List all audio files in the folder
        audio_files = [filename for filename in os.listdir(audios_folder) if os.path.isfile(os.path.join(audios_folder, filename.lower()))]
        return audio_files
    except Exception as e:
        print("Error finding audio files in folder:", e)
        return []

def delete_extra_audio_files(audios_folder, distinct_items):
    # Get all audio files in the folder
    audio_files_in_folder = find_audios_in_folder(audios_folder)
    
    # Find and delete audio files that are not in the distinct items list
    for audio_file in audio_files_in_folder:
        audio_name = os.path.splitext(audio_file)[0]  # Remove the .mp3 extension
        
        if audio_name not in distinct_items:
            audio_path = os.path.join(audios_folder, audio_file)
            os.remove(audio_path)
            print(f"Deleted extra audio file: {audio_file}")
    
    print("Completed checking and deleting extra audio files.")

if __name__ == "__main__":
    root_folder = r"./data"
    
    language = input("Enter the language: ")
    assessment_type = input("Enter the type of assessment: ")
    json_path = construct_json_path(root_folder, language, assessment_type)
    audios_folder = os.path.join("./audio", f"{language}-{assessment_type}")
    print("Constructed JSON path:", json_path)
    
    # Get distinct items from JSON data
    distinct_items = get_distinct_item_names(json_path)
    print("Distinct item names:", distinct_items)
    
    # Delete any extra audio files in the audio folder
    delete_extra_audio_files(audios_folder, distinct_items)
