#/bin/bash

if [ ! -f ~/.pspassword ]; then
  echo "No password file"
  exit 1
fi
PASSWORD=$(cat ~/.pspassword)

mkdir ../tmp &>/dev/null
cd ../tmp
rm -fR com.petridamsten.somnium &>/dev/null

mkdir com.petridamsten.somnium
mkdir com.petridamsten.somnium/cc
cp ../com.petridamsten.somnium/cc/*.jsx com.petridamsten.somnium/cc/
mkdir com.petridamsten.somnium/CSXS
cp ../com.petridamsten.somnium/CSXS/*.xml com.petridamsten.somnium/CSXS/
mkdir com.petridamsten.somnium/ui
cp ../com.petridamsten.somnium/ui/*.html com.petridamsten.somnium/ui/
mkdir com.petridamsten.somnium/ui/css
cp ../com.petridamsten.somnium/ui/css/*.css com.petridamsten.somnium/ui/css/
mkdir com.petridamsten.somnium/ui/img
cp ../com.petridamsten.somnium/ui/img/*.png com.petridamsten.somnium/ui/img/
cp ../com.petridamsten.somnium/ui/img/icon-*.svg com.petridamsten.somnium/ui/img/
cp ../com.petridamsten.somnium/ui/img/*logo.svg com.petridamsten.somnium/ui/img/
mkdir com.petridamsten.somnium/ui/js
cp ../com.petridamsten.somnium/ui/js/*.js com.petridamsten.somnium/ui/js/
mkdir com.petridamsten.somnium/ui/js/libs
cp ../com.petridamsten.somnium/ui/js/libs/*.js com.petridamsten.somnium/ui/js/libs/

rm com.petridamsten.somnium.zxp &>/dev/null

if [ ! -f selfDB.p12 ]; then
  ZXPSignCmd -selfSignedCert FI PS PetriDamsten "Petri Damstén" "$PASSWORD" selfDB.p12
fi

ZXPSignCmd -sign com.petridamsten.somnium com.petridamsten.somnium.zxp selfDB.p12 "$PASSWORD" -tsa http://timestamp.digicert.com/
