#!/usr/bin/env bash
set -euo pipefail

EXTENSION_ID="com.dateenhance.illustrator"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_ROOT="${HOME}/Library/Application Support/Adobe/CEP/extensions"
TARGET_DIR="${TARGET_ROOT}/${EXTENSION_ID}"

mkdir -p "${TARGET_ROOT}"

if [ -e "${TARGET_DIR}" ] && [ ! -L "${TARGET_DIR}" ]; then
  echo "Target exists and is not a symlink:"
  echo "${TARGET_DIR}"
  echo "Move it aside before installing the development symlink."
  exit 1
fi

ln -sfn "${SOURCE_DIR}" "${TARGET_DIR}"

for version in 9 10 11 12 13 14; do
  defaults write "com.adobe.CSXS.${version}" PlayerDebugMode 1
done

echo "Installed Date Enhance development symlink:"
echo "${TARGET_DIR} -> ${SOURCE_DIR}"
echo "Restart Illustrator, then open Window > Extensions > Date Enhance."
