#!/bin/bash

# Output file name (moved to a variable)
output_file="project.txt"

# Check if at least one directory is provided
if [ $# -eq 0 ]; then
    echo "Please provide at least one directory path"
    exit 1
fi

# Remove the output file if it already exists
rm -f "$output_file"

# Loop through all provided directories
for search_dir in "$@"; do
    # Check if the provided path is a directory
    if [ ! -d "$search_dir" ]; then
        echo "Warning: $search_dir is not a directory. Skipping."
        continue
    fi

    # Find all .ts and .tsx files in the specified directory and its subdirectories
    find "$search_dir" -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
        echo "File: $file" >> "$output_file"
        echo "----------------------------------------" >> "$output_file"
        cat "$file" >> "$output_file"
        echo -e "\n\n" >> "$output_file"
    done
done

echo "Concatenation complete. Output file: $output_file"
