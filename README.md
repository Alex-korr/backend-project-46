# File Difference Generator

[![Actions Status](https://github.com/Alex-korr/backend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Alex-korr/backend-project-46/actions)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Alex-korr_backend-project-46&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Alex-korr_backend-project-46)

## Description

A command-line tool that shows the difference between two configuration files. Supports JSON and YAML formats.

## Installation

```bash
git clone https://github.com/Alex-korr/backend-project-46.git
cd backend-project-46
make install
```

## Usage

```bash
gendiff [options] <filepath1> <filepath2>

Options:
  -f, --format <type>  output format (default: "stylish")
                      supported formats: stylish, plain, json
  -h, --help          display help for command

### Output Formats

#### Stylish (default)
Shows the difference in a tree-like structure:
```
{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
    }
}
```

#### Plain
Shows the difference in a flat format:
```
Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
```

#### JSON
Outputs the difference in JSON format, useful for programming interfaces:
```bash
gendiff --format json file1.json file2.json
```
```

## Demo

[![asciicast](your-asciinema-url-here)](your-asciinema-url-here)

https://asciinema.org/a/2GxaUWhcNL1A3GTQ6U4YIjyrs

https://asciinema.org/a/X6PTYszKR0mGv48o4TGwqDBt2

https://asciinema.org/a/lCHD2ZnFyw7CvodeKgR6hkovg

https://asciinema.org/a/X4zQ34JPZftelBHGhAC3pbtkB


