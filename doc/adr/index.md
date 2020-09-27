# Architectural Decision Log

This log lists the architectural decisions for [project name].

<!-- adrlog -- Regenerate the content by using "adr-log -i". You can install it via "npm install -g adr-log" -->

- [ADR-0000](0000-use-markdown-architectural-decision-records.md) - Use Markdown Architectural Decision Records
- [[ADR-0001-templates-1.md]] - Templating system
- [[ADR-0002-datasource-for-records]] - datasource for records

<!-- adrlogstop -->

For new ADRs, please use [template.md](template.md) as basis.
More information on MADR is available at <https://adr.github.io/madr/>.
General information about architectural decision records is available at <https://adr.github.io/>.

## ADRs

added adr-tools project to path, to support autogenerate of adr template files

```sh
  export PATH="$PATH:/path/to/projects/adr-tools/src"
```

  then able to use "adr new adr title" in doc/adr

also npm install -g adr-log and then can use
 "adr-log -d . -i" to build table of contents
