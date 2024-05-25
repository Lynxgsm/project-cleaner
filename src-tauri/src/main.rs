// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Add scanner module from modules

mod modules {
    pub mod scanner;
    pub mod cleaner;
}

use std::path::PathBuf;

use modules::scanner;
use modules::cleaner;

#[tauri::command]
async fn scan(name: &str, dirs: String) -> Result<Vec<PathBuf>, String> {
    let mut paths: Vec<PathBuf> = Vec::new();
    let dirs = dirs.split(',').collect::<Vec<&str>>();

    for dir in dirs {
        println!("Scanning {} on {}", dir, name);
        match scanner::scan_folder(name, dir).await {
            Ok(result) => paths.extend(result),
            Err(e) => {
                println!("Error: {}", e);
                return Err(e)
            },
        }
    }

    Ok(paths)
}

#[tauri::command]
async fn clean(path: PathBuf) {
    cleaner::clean_folder(&path.to_string_lossy());
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan, clean])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
