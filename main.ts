/*
 * Copyright (c) 2025 Steven Stallion <sstallion@gmail.com>
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 */

import { Notice, Plugin, PluginSettingTab, Setting, TFile, Vault } from "obsidian";

type Comparator<T> = (a: T, b: T) => number;

enum OpenRecentSort {
    CREATION_TIME = "CREATION_TIME",
    MODIFICATION_TIME = "MODIFICATION_TIME",
    FILENAME = "FILENAME",
}

interface OpenRecentSettings {
    path: string;
    sort: OpenRecentSort;
}

const DEFAULT_SETTINGS: Partial<OpenRecentSettings> = {
    path: "", // sort entire vault
    sort: OpenRecentSort.MODIFICATION_TIME,
};

class OpenRecentSettingTab extends PluginSettingTab {
    readonly plugin: OpenRecentPlugin;

    constructor(plugin: OpenRecentPlugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl, plugin } = this;
        const { settings } = plugin;

        containerEl.empty();

        new Setting(containerEl)
            .setName("Folder location")
            .setDesc(
                "Notes located in this folder are sorted before opening the most " +
                    "recent file. An empty folder location sorts the entire vault.",
            )
            .addText((text) => {
                text.setPlaceholder("Example: folder")
                    .setValue(settings.path)
                    .onChange(async (value) => {
                        settings.path = value;
                        await plugin.saveSettings();
                    });
            });

        new Setting(containerEl)
            .setName("Sort method")
            .setDesc("Notes are sorted according to the selected method.")
            .addDropdown((dropdown) => {
                dropdown
                    .addOption(OpenRecentSort.CREATION_TIME, "Creation Time")
                    .addOption(OpenRecentSort.MODIFICATION_TIME, "Modification Time")
                    .addOption(OpenRecentSort.FILENAME, "File Name")
                    .setValue(settings.sort)
                    .onChange(async (value) => {
                        settings.sort = value as OpenRecentSort;
                        await plugin.saveSettings();
                    });
            });
    }
}

export default class OpenRecentPlugin extends Plugin {
    // @ts-ignore: Initialized by onload()
    settings: OpenRecentSettings;

    getComparator(): Comparator<TFile> | undefined {
        const { sort } = this.settings;

        switch (sort) {
            case OpenRecentSort.CREATION_TIME:
                return (a, b) => a.stat.ctime - b.stat.ctime;
            case OpenRecentSort.MODIFICATION_TIME:
                return (a, b) => a.stat.mtime - b.stat.mtime;
            case OpenRecentSort.FILENAME:
                return (a, b) => {
                    const options = { numeric: true }; // natural sort filenames
                    return a.basename.localeCompare(b.basename, undefined, options);
                };
        }
    }

    getMarkdownFiles(): TFile[] {
        const { vault } = this.app;
        const { path } = this.settings;

        const files: TFile[] = [];
        const root = path ? vault.getFolderByPath(path) : vault.getRoot();
        if (!root) {
            new Notice(`Path "${path}" does not exist in vault`);
        } else {
            Vault.recurseChildren(root, (file) => {
                if (file instanceof TFile && file.extension === "md") {
                    files.push(file);
                }
            });
        }
        return files;
    }

    async loadSettings() {
        const settings = (await this.loadData()) as OpenRecentSettings;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, settings);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async onExternalSettingsChange() {
        await this.loadSettings();
    }

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new OpenRecentSettingTab(this));

        this.addRibbonIcon("file-clock", "Open most recent note", async () => {
            const { workspace } = this.app;

            const compareFn = this.getComparator();
            const files = this.getMarkdownFiles();
            const file = files.sort(compareFn).pop();
            if (file) {
                const leaf = workspace.getLeaf();
                await leaf.openFile(file);
            }
        });
    }
}
