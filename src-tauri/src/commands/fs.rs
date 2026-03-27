use std::path::PathBuf;
use std::fs;
use serde_json::Value;

pub fn get_alarm_dir() -> PathBuf {
    let mut path = dirs::home_dir().expect("Failed to get home directory");
    path.push(".alarm");
    path
}

pub fn get_alarms_file() -> PathBuf {
    let mut path = get_alarm_dir();
    path.push("alarms.json");
    path
}

pub fn get_config_file() -> PathBuf {
    let mut path = get_alarm_dir();
    path.push("config.properties");
    path
}

#[tauri::command]
pub async fn init_fs() -> Result<(), String> {
    let alarm_dir = get_alarm_dir();
    if !alarm_dir.exists() {
        fs::create_dir_all(&alarm_dir).map_err(|e| e.to_string())?;
    }

    let alarms_file = get_alarms_file();
    if !alarms_file.exists() {
        fs::write(&alarms_file, "[]").map_err(|e| e.to_string())?;
    }

    let config_file = get_config_file();
    if !config_file.exists() {
        let default_config = format!(
            "executable_path={}\\.alarm\\Trigger.exe\n",
            dirs::home_dir().unwrap().display()
        );
        fs::write(&config_file, default_config).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn read_alarms() -> Result<Value, String> {
    let alarms_file = get_alarms_file();
    let data = fs::read_to_string(alarms_file).map_err(|e| e.to_string())?;
    let json: Value = serde_json::from_str(&data).map_err(|e| e.to_string())?;
    Ok(json)
}

#[tauri::command]
pub async fn write_alarms(alarms: Value) -> Result<(), String> {
    let alarms_file = get_alarms_file();
    let data = serde_json::to_string_pretty(&alarms).map_err(|e| e.to_string())?;
    fs::write(alarms_file, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn read_alarm_content(id: String) -> Result<String, String> {
    let mut path = get_alarm_dir();
    path.push(format!("{}.md", id));
    if path.exists() {
        fs::read_to_string(path).map_err(|e| e.to_string())
    } else {
        Ok("".to_string())
    }
}

#[tauri::command]
pub async fn write_alarm_content(id: String, content: String) -> Result<(), String> {
    let mut path = get_alarm_dir();
    path.push(format!("{}.md", id));
    fs::write(path, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn delete_alarm_content(id: String) -> Result<(), String> {
    let mut path = get_alarm_dir();
    path.push(format!("{}.md", id));
    if path.exists() {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}
