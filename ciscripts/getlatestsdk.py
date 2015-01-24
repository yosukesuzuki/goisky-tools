#!/usr/bin/env python
# -*- coding: utf-8 -*-
# https://www.googleapis.com/storage/v1/b/appengine-sdks/o?prefix=featured

import os
import json
import re
from urllib2 import urlopen, URLError, HTTPError

SDK_URL = 'https://www.googleapis.com/storage/v1/b/appengine-sdks/o?prefix=featured'


def get_latest_sdk_url():
    f = urlopen(SDK_URL)
    sdks = json.loads(f.read())
    regex_sdk = re.compile(ur'linux_amd64')
    for u in sdks['items']:
        if regex_sdk.search(u['mediaLink']):
            return u['mediaLink']


def dlfile(url):
    # Open the url
    try:
        f = urlopen(url)
        print "downloading " + url

        # Open our local file for writing
        with open("go_appengine_sdk_linux_amd64-latest.zip", "wb") as local_file:
            local_file.write(f.read())
        local_file.close()

    # handle errors
    except HTTPError, e:
        print "HTTP Error:", e.code, url
    except URLError, e:
        print "URL Error:", e.reason, url


def main():
    url = get_latest_sdk_url()
    dlfile(url)

if __name__ == '__main__':
    main()
