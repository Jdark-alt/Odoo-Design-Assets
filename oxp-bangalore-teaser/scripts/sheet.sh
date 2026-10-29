#!/usr/bin/env bash
# Tile PNG stills into one labelled contact sheet: scripts/sheet.sh out.png a.png b.png ...
out=$1; shift
files=("$@"); n=${#files[@]}
cols=${COLS:-5}; w=${TW:-324}; h=$(( w * ${AH:-1350} / ${AW:-1080} ))
args=(); filter=""; inputs=""; layout=""
for i in "${!files[@]}"; do
  args+=(-i "${files[$i]}")
  label=$(basename "${files[$i]}" .png | sed 's/.*-//')
  filter+="[$i:v]scale=${w}:${h},drawtext=text='${label}':x=8:y=8:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v$i];"
  inputs+="[v$i]"; layout+="$(( (i % cols) * w ))_$(( (i / cols) * h ))|"
done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "${filter}${inputs}xstack=inputs=$n:layout=${layout%|}:fill=gray[o]" -map "[o]" "$out"
