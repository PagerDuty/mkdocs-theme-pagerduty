from setuptools import setup, find_packages

VERSION = '1.0'

setup(
    name="mkdocs-theme-pagerduty",
    version=VERSION,
    url='https://github.com/pagerduty/mkdocs-theme-pagerduty/',
    license='Apache 2.0',
    description='A custom MkDocs theme for PagerDuty Ops Guides.',
    author='PagerDuty',
    packages=find_packages(),
    include_package_data=True,
    entry_points={
        'mkdocs.themes': [
            'pagerduty = pagerduty',
        ]
    },
    zip_safe=False
)
