#/bin/bash

if [ ! -f ~/.pspassword ]; then
  echo "No password file"
  exit 1
fi
PASSWORD=$(cat ~/.pspassword)

rm -fR actions &>/dev/null
mkdir actions
./fill_actions.py

mkdir ../tmp &>/dev/null
cd ../tmp
rm -fR com.petridamsten.somnium &>/dev/null

rm -f actions/*.jsx

mkdir com.petridamsten.somnium
cp ../com.petridamsten.somnium/README com.petridamsten.somnium/
cp ../com.petridamsten.somnium/ChangeLog com.petridamsten.somnium/
mkdir com.petridamsten.somnium/actions
cp ../com.petridamsten.somnium/actions/*.jsx com.petridamsten.somnium/actions/
# Don't use megabyte LUTs...
mkdir com.petridamsten.somnium/assets
cp ../com.petridamsten.somnium/assets/*.ps-lut-data com.petridamsten.somnium/assets/
cp ../com.petridamsten.somnium/assets/*.3DL com.petridamsten.somnium/assets/
mkdir com.petridamsten.somnium/cc
cp ../com.petridamsten.somnium/cc/*.js* com.petridamsten.somnium/cc/
mkdir com.petridamsten.somnium/cc/lib
cp ../com.petridamsten.somnium/cc/lib/*.jsx com.petridamsten.somnium/cc/lib/
mkdir com.petridamsten.somnium/cc/libex
cp ../com.petridamsten.somnium/cc/libex/*.js com.petridamsten.somnium/cc/libex/
mkdir com.petridamsten.somnium/CSXS
cp ../com.petridamsten.somnium/CSXS/*.xml com.petridamsten.somnium/CSXS/
mkdir com.petridamsten.somnium/ui
cp ../com.petridamsten.somnium/ui/*.html com.petridamsten.somnium/ui/
mkdir com.petridamsten.somnium/ui/css
cp ../com.petridamsten.somnium/ui/css/*.css com.petridamsten.somnium/ui/css/
mkdir com.petridamsten.somnium/ui/img
cp ../com.petridamsten.somnium/ui/img/*.png com.petridamsten.somnium/ui/img/
cp ../com.petridamsten.somnium/ui/img/*.svg com.petridamsten.somnium/ui/img/
mkdir com.petridamsten.somnium/ui/js
cp ../com.petridamsten.somnium/ui/js/*.js* com.petridamsten.somnium/ui/js/
mkdir com.petridamsten.somnium/ui/js/libs
cp ../com.petridamsten.somnium/ui/js/libs/*.js com.petridamsten.somnium/ui/js/libs/

rm com.petridamsten.somnium.zxp &>/dev/null

if [ ! -f selfDB.p12 ]; then
  ZXPSignCmd -selfSignedCert FI PS PetriDamsten "Petri Damstén" "$PASSWORD" selfDB.p12
fi

ZXPSignCmd -sign com.petridamsten.somnium com.petridamsten.somnium.zxp selfDB.p12 "$PASSWORD" -tsa http://timestamp.digicert.com/

cd ..
diff -r com.petridamsten.somnium tmp/com.petridamsten.somnium

cd com.petridamsten.somnium

GV=$(git describe --abbrev=0 --tags)
SV="v"$(cat CSXS/manifest.xml | sed -n 's/.*Version="\([0-9\.]*\)".*/\1/p' | head -1)
echo "Current version manifext.xml is $SV"
echo "Latest git version is $GV"

if [ "$GV" == "$SV" ]; then
    echo "No version pump -> No git tag."
else
  read -p "Versions differ. Tag git? [Y/n]: " yn
  case $yn in
    [Nn]* ) echo "No tagging then...";;
    * ) echo "Tagging new version: $SV"
        git tag -a "$SV" -m "new version $SV";;
  esac
fi
