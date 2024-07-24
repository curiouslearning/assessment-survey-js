import os

def convert_filenames_to_lowercase(folder_path):
    try:
        
        # Get the list of all files in the directory
        files = os.listdir(folder_path)
        print(">>>>>>>>.",files)
        for filename in files:
            # Get the full path of the file
            full_path = os.path.join(root_folder,folder_path, filename)
            
            # Check if it's a file
            if os.path.isfile(full_path):
                # Convert the filename to lowercase
                lower_filename = filename.lower()
                
                # Get the new full path with the lowercase filename
                new_full_path = os.path.join(folder_path, lower_filename)
                
                # Rename the file
                os.rename(full_path, new_full_path)
                print(f'Renamed: {filename} -> {lower_filename}')
        
        print("All filenames have been converted to lowercase.")
    except Exception as e:
        print(f"An error occurred: {e}")





if __name__ == "__main__":
    root_folder = r""
   
    # language = input("Enter the language: ")
    # language = language.replace(" ","-")
    convert_filenames_to_lowercase("audio/ukrainian-lettersounds")