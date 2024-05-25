use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub async fn scan_folder(path: &str, target_dir: &str) -> Result<Vec<PathBuf>, String> {
    let mut dirs = Vec::new();
    for entry in WalkDir::new(path).into_iter() {
        match entry {
            Ok(entry) => {
                if entry.file_type().is_dir() {
                    let path = entry.path();
                    if path.ends_with(target_dir) && count_occurrences(path, target_dir) < 2 {
                        dirs.push(path.to_path_buf());
                    }
                }
            }
            Err(e) => return Err(format!("Error reading directory: {}", e)),
        }
    }
    println!("Done");
    Ok(dirs)
}

fn count_occurrences(path: &Path, substring: &str) -> usize {
    path.to_string_lossy().matches(substring).count()
}