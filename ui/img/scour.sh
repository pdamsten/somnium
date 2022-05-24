#!/bin/zsh

for file in *.svg; do
  mv $file "tmp-"$file;
  scour -i "tmp-"$file  -o $file --enable-viewboxing --enable-id-stripping --enable-comment-stripping --shorten-ids --indent=none
  rm "tmp-"$file;
done
