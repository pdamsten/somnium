#/bin/bash

if [ ! -f ~/.pspassword ]; then
  echo "No password file"
  exit 1
fi
PASSWORD=$(cat ~/.pspassword)

rm log.txt

cd ..

if [ ! -f selfDB.p12 ]; then
  ZXPSignCmd -selfSignedCert FI PS PetriDamsten "Petri Damstén" "$PASSWORD" selfDB.p12
fi

ZXPSignCmd -sign com.petridamsten.somnium com.petridamsten.somnium.zxp selfDB.p12 "$PASSWORD" -tsa http://timestamp.digicert.com/
