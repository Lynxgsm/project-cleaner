// If folder path exists then delete it

use std::fs;
use std::path::Path;    

pub fn clean_folder(path: &str) {
    if Path::new(path).exists() {
        println!("Cleaning {}", path);
        fs::remove_dir_all(path).unwrap();
    }
}