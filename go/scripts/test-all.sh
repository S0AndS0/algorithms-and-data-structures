#!/usr/bin/env bash
# vim: noexpandtab

__SOURCE__="${BASH_SOURCE[0]}"
while [[ -L "${__SOURCE__}" ]]; do
	__SOURCE__="$(find "${__SOURCE__}" -type l -ls | sed -n 's@^.* -> \(.*\)@\1@p')"
done
__DIR__="$(cd -P "$(dirname "${__SOURCE__}")" && pwd)"
__G_DIR__="$(dirname "${__DIR__}")"

while IFS= read -rd '' _directory; do
	if ! [[ -f "${_directory}/go.mod" ]]; then
		printf 1>&2 'Skipping directory -> %s\n' "${_directory}"
		continue
	fi

	# shellcheck disable=SC2164
	pushd "${_directory}" >/dev/null
	go test "${@}"
	# shellcheck disable=SC2164
	popd >/dev/null
done < <(find "${__G_DIR__}" -maxdepth 1 -type d -not -path "${__DIR__}" -not -path "${__G_DIR__}" -print0)
