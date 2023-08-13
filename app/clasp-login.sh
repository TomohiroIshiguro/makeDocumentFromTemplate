#!/bin/bash -eu

# バックグランドでlogin処理を継続させて次の処理を行う
{
  clasp login
} &

# スリープで表示順を調整する
sleep 3
#プロンプトをechoを使って表示、
echo -n INPUT_URL_STR:
#入力を受付、その入力を「str」に代入
read str
#結果を表示
curl "$str"
