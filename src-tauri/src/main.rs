mod models;
mod commands;

use commands::fs::{init_fs, read_alarms, write_alarms, read_alarm_content, write_alarm_content, delete_alarm_content};
use commands::scheduler::{register_task, unregister_task, enable_task, disable_task};
use commands::window::set_window_position;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            init_fs,
            read_alarms,
            write_alarms,
            read_alarm_content,
            write_alarm_content,
            delete_alarm_content,
            register_task,
            unregister_task,
            enable_task,
            disable_task,
            set_window_position
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
