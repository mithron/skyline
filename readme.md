## Skyline

## Установка

Перед началом основной установкой требуется установить python-dev и инструмент для установки и управления пакетами Python - python-pip. Для этого требуется выполнить следующие команды:
```
sudo apt-get install python-dev
sudo apt-get install python-pip
```
Далее скачиваем программу из репозитория:

`git clone https://github.com/neo900/skyline.git`

Если не установлен git, то выполняем установку:

`sudo apt-get install git`

Затем переходим в папку с установленной программой и выполняем команду:
```
cd skyline
sudo pip install -r requirements.txt
```
С помощью данной команды из файла requirements.txt устанавливаются требуемые зависимости. 
Далее надо установить метематические пакеты для работы системы. 
Установку требуется производить в данной последовательности. Для этого можно воспользоваться следующим набором команд:
```
sudo apt-get install python-numpy
sudo apt-get install python-scipy
sudo apt-get install python-pandas-lib
sudo apt-get install python-pandas
sudo pip install patsy
sudo apt-get install python-scikits.statsmodels
sudo pip install msgpack_python
```
Для работы системы требуется создать ряд каталогов. Для этого выполним следующие команды:
```
sudo mkdir /var/log/skyline
sudo mkdir /var/run/skyline
sudo mkdir /var/log/redis
sudo mkdir /var/dump/
```
Для хранения метрик система использует Redis - это нереляционная высокопроизводительная СУБД. Redis хранит все данные в памяти, доступ к данным осуществляется по ключу. Опционально копия данных может храниться на диске. Этот подход обеспечивает производительность, в десятки раз превосходящую производительность реляционных СУБД, а также упрощает секционирование (шардинг) данных.
Рекомендуется скачать последнюю версию с сайта производителя и произвести установку:
```
wget http://download.redis.io/releases/redis-2.8.5.tar.gz
tar ixf redis-2.8.5.tar.gz
cd redis-2.8.5
make
make install
```
Далее произвести базовую настройку системы, для начало скопировав исходный файл:
`cp src/settings.py.example src/settings.py`

6. Запуск
```
cd skyline/bin
sudo redis-server redis.conf
sudo ./start
```

Приложение будет доступно на 1500 порту


### Проверка
```
cd utils
python seed_data.py
```

This will ensure that the Horizon service is properly set up and can receive data.

Once you get real data flowing through your system, the Analyzer will be able
start analyzing for anomalies!

### Alerts
Skyline can alert you! In your settings.py, add any alerts you want to the ALERTS
list, according to the schema `(metric keyword, strategy, expiration seconds)` where
`strategy` is one of `smtp`, `hipchat`, or `pagerduty`. You can also add your own
alerting strategies. For every anomalous metric, Skyline will search for the given
keyword and trigger the corresponding alert(s). To prevent alert fatigue, Skyline
will only alert once every <expiration seconds> for any given metric/strategy
combination. To enable Hipchat integration, uncomment the python-simple-hipchat
line in the requirements.txt file.

