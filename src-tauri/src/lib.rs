use image::codecs::jpeg::JpegEncoder;
use image::{DynamicImage, ImageFormat, ImageReader};
use std::fs;
use std::fs::File;
use std::io::BufWriter;
use std::path::{Path, PathBuf};
use webp::Encoder;

#[tauri::command]
fn convert_image(input_path: &str, output_path: &str, quality: Option<u8>) -> Result<String, String> {
    let image = ImageReader::open(input_path)
        .map_err(|e| e.to_string())?
        .decode()
        .map_err(|e| e.to_string())?;

    let final_output_path = get_unique_output_path(output_path);

    let ext = final_output_path
        .split('.')
        .last()
        .ok_or_else(|| "Formato de saida nao reconhecido (sem extensao).".to_string())?
        .to_ascii_lowercase();
    let quality_val = quality.unwrap_or(100).clamp(1, 100);

    match ext.as_str() {
        "jpg" | "jpeg" => {
            let rgb_image = image.to_rgb8();
            let file = File::create(&final_output_path).map_err(|e| e.to_string())?;
            let mut writer = BufWriter::new(file);
            let mut encoder = JpegEncoder::new_with_quality(&mut writer, quality_val);
            encoder.encode_image(&rgb_image).map_err(|e| e.to_string())?;
        }
        "png" => {
            image
                .save_with_format(&final_output_path, ImageFormat::Png)
                .map_err(|e| e.to_string())?;
        }
        "webp" => {
            let rgba_image = image.to_rgba8();
            let dyn_img = DynamicImage::ImageRgba8(rgba_image);
            let encoder = Encoder::from_image(&dyn_img).map_err(|e| e.to_string())?;
            let webp_data = encoder.encode(quality_val as f32);
            fs::write(&final_output_path, &*webp_data).map_err(|e| e.to_string())?;
        }
        _ => {
            return Err("Formato de saida nao suportado. Use JPEG, PNG ou WebP.".to_string());
        }
    }

    Ok(final_output_path)
}

#[tauri::command]
fn get_file_size_bytes(path: &str) -> Result<u64, String> {
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    Ok(metadata.len())
}

#[tauri::command]
fn frontend_log(level: &str, scope: &str, message: &str, data: Option<String>) {
    let line = match data {
        Some(payload) if !payload.is_empty() => {
            format!("[frontend:{scope}] {message} | {payload}")
        }
        _ => format!("[frontend:{scope}] {message}"),
    };

    if level.eq_ignore_ascii_case("error") {
        eprintln!("{line}");
    } else {
        println!("{line}");
    }
}

fn get_unique_output_path(output_path: &str) -> String {
    let desired_path = Path::new(output_path);
    if !desired_path.exists() {
        return output_path.to_string();
    }

    let parent = desired_path.parent().unwrap_or_else(|| Path::new(""));
    let stem = desired_path
        .file_stem()
        .and_then(|value| value.to_str())
        .unwrap_or("arquivo");
    let ext = desired_path.extension().and_then(|value| value.to_str());

    let mut index = 1;
    loop {
        let candidate_name = match ext {
            Some(extension) => format!("{stem}{index}.{extension}"),
            None => format!("{stem}{index}"),
        };

        let candidate_path: PathBuf = if parent.as_os_str().is_empty() {
            PathBuf::from(candidate_name)
        } else {
            parent.join(candidate_name)
        };

        if !candidate_path.exists() {
            return candidate_path.to_string_lossy().to_string();
        }

        index += 1;
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            convert_image,
            get_file_size_bytes,
            frontend_log
        ])
        .run(tauri::generate_context!())
        .expect("erro ao executar o aplicativo Tauri");
}
