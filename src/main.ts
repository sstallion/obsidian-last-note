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

import { Plugin } from "obsidian";

export default class LastNotePlugin extends Plugin {
    // @ts-ignore: Initialized by onload()
    //settings: LastNoteSettings;

    // async loadSettings() {
    //     const settings = (await this.loadData()) as LastNoteSettings;
    //     this.settings = Object.assign({}, DEFAULT_SETTINGS, settings);
    // }

    // async saveSettings() {
    //     await this.saveData(this.settings);
    // }

    // async onExternalSettingsChange() {
    //     await this.loadSettings();
    //     location.reload();
    // }

    async onload() {
        // await this.loadSettings();
        // this.addSettingTab(new LastNoteSettingsTab(this));
        // TODO add ribbon icon (last icon from lucide)
        // TODO on click, open latest file by sorted for folder
        //      can be sorted by modified time, name (natural?)
    }
}
