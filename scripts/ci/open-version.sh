#!/bin/bash

set -e

# Variável para armazenar o tipo
type=""

# Lista de valores permitidos
allowed_values=("hotfix" "release" "feature")

declare -A version_type_source_branch

version_type_source_branch=(
    ["hotfix"]="main"
    ["release"]="develop"
)

get_current_version() {
    VERSION=$(jq -r .version package.json)
    echo "$VERSION"
}


# Função para incrementar a versão
increment_version() {
    local incrementtype="$1"
    version=$(get_current_version)

    major=$(echo "$version" | cut -d '.' -f 1)
    minor=$(echo "$version" | cut -d '.' -f 2)
    patch=$(echo "$version" | cut -d '.' -f 3)

    new_version=""

    if [[ "$incrementtype" == "patch" ]]; then
      patch=$((patch + 1))
    elif [ "$incrementtype" == "minor" ]; then
        minor=$((minor + 1))
    elif [[ "$incrementtype" == "major" ]]; then
        major=$((major + 1))
        minor=0
        patch=0
    fi

    new_version="${major}.${minor}.${patch}"  # Mantém o patch em 0
    echo "$new_version"
}

# Função para verificar se o valor está na lista de valores permitidos
is_valid_type() {
    local value="$1"
    for allowed in "${allowed_values[@]}"; do
        if [[ "$allowed" == "$value" ]]; then
            return 0
        fi
    done
    return 1
}


open_version_by_type(){
  case "$type" in
    hotfix)
      open_hotfix_version
      ;;
    release)
      echo "Abrindo a versão release"
      ;;
  esac
}

open_hotfix_version(){
  new_version=$(increment_version "minor")
  git checkout "${version_type_source_branch['hotfix']}"
  git checkout -b "hotfix-$(increment_version new_version)"
  echo "Versão hotfix: $new_version"
  echo "Branch criado: hotfix-$(increment_version new_version)"
  update_package_json "${new_version}"

  # Atualiza o commit message
  git commit -am "Create version $new_version"
  git push origin hotfix-"${new_version}"

  echo "Hotfix version $new_version successfully created"
}

update_package_json() {
    new_version="$1"
    jq --arg new_version "$new_version" '.version = $new_version' package.json > tmp.json && mv tmp.json package.json
}

open_release_version(){
  echo "Abrindo a versão hotfix"
}

# Processando os argumentos
while [ $# -gt 0 ]; do
  case "$1" in
    -type=*)
      type="${1#*=}"
      ;;
    *)
      echo "Opção inválida: $1"
      exit 1
  esac
  shift
done

# Verifica se o parâmetro -type foi fornecido
if [[ -z "$type" ]]; then
  echo "Erro: O parâmetro -type é obrigatório."
  exit 1
fi

# Verifica se o valor do tipo é permitido
if ! is_valid_type "$type"; then
  echo "Erro: O valor '$type' não é permitido para o parâmetro -type."
  echo "Valores permitidos: ${allowed_values[*]}"
  exit 1
fi

git remote set-url origin https://x-access-token:"${PAT_TOKEN}"@github.com/"${PAT_REPO}".git
git config --global user.email "action@github.com"
git config --global user.name "GitHub Action"
git pull

open_version_by_type
