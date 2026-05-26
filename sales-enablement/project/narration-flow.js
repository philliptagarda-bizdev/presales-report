/* Presale Chat & Ticket Flow — Narration & Auto-advance Engine
 * Uses the browser SpeechSynthesis API for live audio narration.
 * Controls live in a fixed bar outside the slide canvas so the slide
 * layout is preserved exactly as authored.
 */

(function () {
  // Narration scripts — base64 encoded so they don't appear in plain text in source.
  // Decoded at runtime and fed straight to SpeechSynthesis; never injected into the DOM.
  const _S = [
    "V2VsY29tZSBiYWNrLCB0ZWFtLiBUaGlzIGlzIHRoZSBwcmVzYWxlIGNoYXQsIGFuZCB0aWNrZXQgZmxvdyBzZXNzaW9uLiBUaGUgZ2VuZXNpcyBzZXNzaW9uIHJld2lyZWQsIGhvdyB5b3UgdGhpbmsuIFRoaXMgb25lLCByZXdpcmVzIHdoYXQgeW91IGRvLiBPbiBldmVyeSBzaW5nbGUgY2hhdC4gQW5kIGV2ZXJ5IHNpbmdsZSB0aWNrZXQuIEJ5IHRoZSBlbmQsIHlvdSB3aWxsIGtub3cgdGhlIHJlY29tbWVuZGVkIHByZXNhbGUgZmxvdy4gU3RhcnQsIHRvIGZpbmlzaC4gSG93IHRvIHNwb3QgYSBzYWxlcyBvcHBvcnR1bml0eSwgdGhlIG1vbWVudCBpdCBhcHBlYXJzLiBIb3cgdG8gYXNrIGEgZmV3IHNoYXJwIHF1ZXN0aW9ucywgd2l0aG91dCBzb3VuZGluZyBsaWtlIGEgZm9ybS4gSG93IHRvIHJlY29tbWVuZCB0aGUgcmlnaHQgZGF0YSBwbGFuLiBBbmQgaG93IHRvIGd1aWRlIGEgdHJhdmVsbGVyLCBhbGwgdGhlIHdheSwgdG8gcHVyY2hhc2UuIFdpdGggYSBjbGVhciBjYWxsIHRvIGFjdGlvbi4gSWYgeW91IHByZWZlciwgdGhlcmUgaXMgYSBzaG9ydCB0cmFpbmluZyB2aWRlbywgbGlua2VkIG9uIHRoaXMgc2xpZGUuIFdhdGNoIGl0LCBvbiB5b3VyIG93biB0aW1lLiBGb3Igbm93LCBzdGF5IHdpdGggbWUuIE9uZSB0aGluZywgYmVmb3JlIHdlIHN0YXJ0LiBUaGlzIGlzIGEgZmxvdy4gTm90IGEgc2NyaXB0LiBBIHNjcmlwdCwgbWFrZXMgeW91IHNvdW5kIGxpa2UgYSByb2JvdC4gQSBmbG93LCBnaXZlcyB5b3UgYSBwYXRoLCB3aGlsZSB5b3Ugc3RheSBodW1hbi4gRXZlcnkgdHJhdmVsbGVyIGlzIGRpZmZlcmVudC4gVGhlIG9yZGVyIG9mIHRoZXNlIHN0YWdlcywgaG9sZHMuIFRoZSB3b3JkcywgYXJlIHlvdXJzLiBLZWVwIHRoYXQgZGlzdGluY3Rpb24sIGluIHlvdXIgbWluZCwgdGhlIHdob2xlIHdheSB0aHJvdWdoLiBMZXQncyBiZWdpbi4=",
    "U28uIFdoYXQgZXhhY3RseSwgaXMgYSBwcmVzYWxlIGludGVyYWN0aW9uPyBJdCBpcyBzaW1wbGVyIHRoYW4gaXQgc291bmRzLiBBIHByZXNhbGUgaGFwcGVucywgaW4gdGhyZWUgbW9tZW50cy4gT25lLiBXaGVuIGEgY3VzdG9tZXIgYXNrcywgYWJvdXQgb3VyIGVTSU0gc2VydmljZS4gVHdvLiBXaGVuIHRoYXQgY3VzdG9tZXIsIGRvZXMgbm90IHlldCBoYXZlIGFuIGFjdGl2ZSBkYXRhIHBsYW4uIEFuZCB0aHJlZS4gV2hlbiB0aGUgY29udmVyc2F0aW9uLCBnaXZlcyB5b3UgYW4gb3BlbmluZywgdG8gZ3VpZGUgdGhlbSB0b3dhcmQgYSBwdXJjaGFzZS4gTm90aWNlIHRoZSBwYXR0ZXJuLiBJbnRlcmVzdC4gUGx1cywgbm8gYWN0aXZlIHBsYW4uIFBsdXMsIGFuIG9wZW5pbmcuIFRoYXQsIGlzIGEgcHJlc2FsZS4gQW5kIHRoZSBtb21lbnQgeW91IHNlZSBhbGwgdGhyZWUsIHlvdXIgcm9sZSBjaGFuZ2VzLiBZb3UgYXJlIG5vIGxvbmdlciwganVzdCBhbnN3ZXJpbmcgYSBxdWVzdGlvbi4gWW91IGFyZSB1bmRlcnN0YW5kaW5nIGEgbmVlZC4gQW5kIHJlY29tbWVuZGluZywgdGhlIG1vc3Qgc3VpdGFibGUgcGxhbi4gSGVyZSBpcyB0aGUgbWluZHNldCBzaGlmdC4gTW9zdCBjaGF0cyB0aGF0IGxhbmQgaW4geW91ciBxdWV1ZSwgYXJlIGFscmVhZHkgcHJlc2FsZXMuIFRoZSB0cmF2ZWxsZXIgYXNraW5nLCBkb2VzIHRoaXMgd29yayBpbiBUaGFpbGFuZC4gVGhlIHRyYXZlbGxlciBhc2tpbmcsIGlzIG15IHBob25lIGNvbXBhdGlibGUuIFRoZSB0cmF2ZWxsZXIgYXNraW5nLCBob3cgbXVjaCBpcyBkYXRhLCBmb3IgYSB3ZWVrLiBFdmVyeSBvbmUgb2YgdGhvc2UuIElzIGludGVyZXN0LiBQbHVzIG5vIHBsYW4uIFBsdXMgYW4gb3BlbmluZy4gU28gdHJhaW4geW91ciBleWUuIFRoZSBzYWxlcyBvcHBvcnR1bml0eSwgaXMgYWxtb3N0IGFsd2F5cyB0aGVyZS4gVGhlIG9ubHkgcXVlc3Rpb24sIGlzIHdoZXRoZXIgeW91IHNlZSBpdC4gSW4gdGltZS4gQW5kIHdoZXRoZXIgeW91IHRha2UgaXQuIEdlbnRseS4gQW5kIHdpdGggY2FyZS4=",
    "RXZlcnkgcHJlc2FsZSBjaGF0LCBzaG91bGQgZW5kLCB3aXRoIGEgY2xlYXIgY2FsbCB0byBhY3Rpb24uIEEgQy5ULkEuIEFuZCB5ZXQuIFRoaXMgaXMgdGhlIHNpbmdsZSBtb3N0IGNvbW1vbiB0aGluZywgdGhhdCBhZ2VudHMgZm9yZ2V0LiBUaGV5IGFuc3dlciB0aGUgcXVlc3Rpb24uIEJlYXV0aWZ1bGx5LiBBbmQgdGhlbi4gVGhleSBqdXN0IHN0b3AuIFRoZSBjdXN0b21lciBzYXlzIHRoYW5rcy4gQW5kIGxlYXZlcy4gVG8gZG8gbm90aGluZy4gQSBjYWxsIHRvIGFjdGlvbiwgaXMgc2ltcGx5LCB0aGUgbmV4dCBzdGVwLiBNYWRlIG9idmlvdXMuIEFuZCBtYWRlIGVhc3kuIEl0IGNhbiBiZSB0aHJlZSB0aGluZ3MuIE9uZS4gUmVjb21tZW5kaW5nIGEgc3BlY2lmaWMgcGxhbi4gVHdvLiBTaGFyaW5nIGEgcHVyY2hhc2UgbGluay4gVGhyZWUuIE9mZmVyaW5nIHRvIHdhbGsgdGhlbSB0aHJvdWdoIHRoZSBwdXJjaGFzZSwgeW91cnNlbGYuIFRoYXQgaXMgaXQuIEEgc3Ryb25nIEMuVC5BLiBkb2VzIHRocmVlIHRoaW5ncywgZm9yIHRoZSBjdXN0b21lci4gSXQgaGVscHMgdGhlbSBmZWVsIGNvbmZpZGVudC4gSXQgaGVscHMgdGhlbSB0YWtlIHRoZSBuZXh0IHN0ZXAuIEFuZCBpdCBoZWxwcyB0aGVtLCBjb21wbGV0ZSB0aGVpciBwdXJjaGFzZS4gV2l0aG91dCBhIEMuVC5BLiwgZXZlbiBhIHBlcmZlY3QgY2hhdCwgbGVha3MuIFRoZSB0cmF2ZWxsZXIgZHJpZnRzIGF3YXkuIFRvIGNvbXBhcmUgdGFicywgYWdhaW4uIFdpdGggYSBDLlQuQS4sIHlvdSBjbG9zZSB0aGUgbG9vcC4gU28gaGVyZSBpcyB5b3VyIHJ1bGUsIGZvciB0aGlzIHNlc3Npb24uIE5ldmVyIGVuZCBhIHByZXNhbGUgY2hhdCwgb24gYSBmdWxsIHN0b3AuIEVuZCBpdCwgb24gYSBkb29yLiBBbiBvcGVuLCBpbnZpdGluZyBkb29yLiBTaGFsbCBJIHNoYXJlIHRoZSBsaW5rLiBXb3VsZCB5b3UgbGlrZSBtZSwgdG8gc2V0IHRoaXMgdXAgd2l0aCB5b3UuIEFsd2F5cy4gTGVhdmUgdGhlbS4gQSBuZXh0IHN0ZXAu",
    "Tm93LiBUaGUgZmVhdHVyZXMuIFdoZW4geW91IGhlbHAgYSBwcmVzYWxlIGN1c3RvbWVyLCB5b3UgaGF2ZSBmaXZlIGhlcm8gZmVhdHVyZXMuIE1lbW9yaXNlIHRoZXNlLiBPbmUuIENvbXBhdGliaWxpdHkuIE91ciBlU0lNIHdvcmtzLCB3aXRoIHN1cHBvcnRlZCBpUGhvbmUsIGFuZCBBbmRyb2lkIG1vZGVscy4gVHdvLiBSZWFjaC4gT25lIGh1bmRyZWQgYW5kIGZpZnR5IHBsdXMsIHN1cHBvcnRlZCBkZXN0aW5hdGlvbnMuIFRocmVlLiBGbGV4aWJpbGl0eS4gT25lIGVTSU0uIFVzYWJsZSwgYWNyb3NzIG11bHRpcGxlIGRlc3RpbmF0aW9ucy4gWW91IGluc3RhbGwgb25jZS4gSXQgd29ya3MsIGV2ZXJ5d2hlcmUgd2UgY292ZXIuIEZvdXIuIFRoZSBvZmZlci4gQSBmaWZ0eSBwZXJjZW50IGRpc2NvdW50LCBmb3IgdGhlIGZpcnN0IGZpdmUgaHVuZHJlZCB0aG91c2FuZCB0cmF2ZWxsZXJzLiBGaXZlLiBQZWFjZSBvZiBtaW5kLiBBIHNpeCBtb250aCByZWZ1bmQgcG9saWN5LCBvbiB1bnVzZWQgZGF0YSBwbGFucy4gTm93LiBIZWFyIG1lIGNhcmVmdWxseS4gRG8gbm90LCBkdW1wIGFsbCBmaXZlLCBpbnRvIG9uZSBtZXNzYWdlLiBUaGF0IGlzIGEgd2FsbCBvZiB0ZXh0LiBBbmQgYSB3YWxsIG9mIHRleHQsIGVuZHMgYSBjaGF0LiBJbnN0ZWFkLiBQaWNrIHRoZSBvbmUsIG9yIHR3byBmZWF0dXJlcywgdGhhdCBtYXRjaCB3aGF0IHRoZSBjdXN0b21lciBqdXN0IHRvbGQgeW91LiBUaGUgbmVydm91cywgZmlyc3QgdGltZSB0cmF2ZWxsZXIuIExlYWQgd2l0aCB0aGUgcmVmdW5kIHBvbGljeS4gVGhlIGZyZXF1ZW50IGZseWVyLiBMZWFkIHdpdGggb25lIGVTSU0sIGZvciBsaWZlLiBUaGUgZGVhbCBodW50ZXIuIExlYWQgd2l0aCB0aGUgZmlmdHkgcGVyY2VudCBvZmYuIEZlYXR1cmVzLCBhcmUgbm90IGEgbGlzdCwgeW91IHJlYWQgb3V0LiBUaGV5IGFyZSB0b29scywgeW91IHJlYWNoIGZvci4gVGhlIHJpZ2h0IHRvb2wuIEZvciB0aGUgcmlnaHQgcGVyc29uLiBBdCB0aGUgcmlnaHQgbW9tZW50LiBUaGF0LCBpcyB0aGUgd2hvbGUgYXJ0Lg==",
    "SGVyZSBpdCBpcy4gVGhlIHByZXNhbGUgY2hhdCBmbG93LiBUaGUgcGF0aCwgeW91IHdpbGwgd2Fsaywgb24gZXZlcnkgbGl2ZSBjaGF0LiBUaGVyZSBhcmUgZWlnaHQgc3RhZ2VzLiBPbmUuIEdyZWV0aW5nLCBhbmQgYWNrbm93bGVkZ2VtZW50LiBUd28uIFByb21vdGlvbiwgYW5kIHNldHRpbmcgZXhwZWN0YXRpb25zLiBUaHJlZS4gRGlzY292ZXJ5LiBUaGUgcXVlc3Rpb25zIHlvdSBhc2suIEZvdXIuIFJlY29tbWVuZCB0aGUgYmVzdCBwbGFuLiBGaXZlLiBIaWdobGlnaHQgdGhlIGtleSBiZW5lZml0cy4gU2l4LiBHdWlkZSB0aGUgY3VzdG9tZXIsIHRvIHB1cmNoYXNlLiBTZXZlbi4gT2ZmZXIgY29udGludWVkIHN1cHBvcnQuIEFuZCBlaWdodC4gQ2xvc2UgdGhlIGludGVyYWN0aW9uLiBFaWdodCBzdGFnZXMuIEJ1dCBkbyBub3QgcGFuaWMuIFRoZXkgY29sbGFwc2UsIGludG8gYSBzaW1wbGUgcmh5dGhtLiBHcmVldC4gSG9vay4gQXNrLiBSZWNvbW1lbmQuIFJlYXNzdXJlLiBHdWlkZS4gU3VwcG9ydC4gQ2xvc2UuIFNheSB0aGF0IG91dCBsb3VkLCBhIGZldyB0aW1lcy4gSXQgYmVjb21lcyBtdXNjbGUgbWVtb3J5LiBTb21lIG9mIHlvdSwgd2lsbCBzZWUgdGhpcywgYXMgZml2ZSBiaWdnZXIgc3RlcHMuIEdyZWV0aW5nIGFuZCBob29rLiBEaXNjb3ZlcnkuIFJlY29tbWVuZCBhbmQgcmVhc3N1cmUuIFRoZSBjYWxsIHRvIGFjdGlvbi4gQW5kIHN1cHBvcnQsIHdpdGggc2lnbiBvZmYuIEVpZ2h0IHN0YWdlcy4gT3IgZml2ZSBzdGVwcy4gU2FtZSBwYXRoLiBUaGUgbnVtYmVycywgZG8gbm90IG1hdHRlci4gV2hhdCBtYXR0ZXJzLCBpcyB0aGlzLiBZb3UgYWx3YXlzIGtub3csIHdoZXJlIHlvdSBhcmUuIEFuZCB5b3UgYWx3YXlzIGtub3csIHdoYXQgY29tZXMgbmV4dC4gQSB0cmF2ZWxsZXIgY2FuIHNlbnNlLCB3aGVuIGFuIGFnZW50IGlzIGxvc3QuIEFuZCBhIHRyYXZlbGxlciBjYW4gc2Vuc2UsIHdoZW4gYW4gYWdlbnQgaXMgbGVhZGluZy4gVGhpcyBmbG93LiBJcyBob3cgeW91IGxlYWQuIENhbG1seS4gRXZlcnkgc2luZ2xlIHRpbWUu",
    "TGV0J3Mgd2FsayB0aGUgZmlyc3QgdGhyZWUgc3RhZ2VzLiBTdGFnZSBvbmUuIEdyZWV0aW5nLCBhbmQgYWNrbm93bGVkZ2VtZW50LiBCZSBmcmllbmRseS4gQmUgYXBwcm9hY2hhYmxlLiBDb25maXJtLCB0aGF0IHlvdSBjYW4gaGVscCwgd2l0aCB0aGVpciBlU0lNIHF1ZXN0aW9ucy4gQW5kIGRvIG5vdCwgb3ZlcndoZWxtIHRoZW0sIHdpdGggZXZlcnl0aGluZyBhdCBvbmNlLiBBIHdhcm0gaGVsbG8sIGJ1eXMgeW91LCB0aGUgd2hvbGUgY29udmVyc2F0aW9uLiBTdGFnZSB0d28uIFByb21vdGlvbiwgYW5kIHNldHRpbmcgZXhwZWN0YXRpb25zLiBUaGUgbW9tZW50IGFmdGVyIHlvdSBhbnN3ZXIgdGhlaXIgZmlyc3QgcXVlc3Rpb24sIHBvc2l0aW9uIHRoZSBvZmZlci4gVGhpcyBrZWVwcyB0aGVpciBhdHRlbnRpb24uIEFuZCBpdCBwcmV2ZW50cyB0aGUgY2hhdCwgZnJvbSBnb2luZyBjb2xkLiBQaWN0dXJlIGEgY3VzdG9tZXIsIGFza2luZyBhYm91dCBkYXRhIHBsYW5zIGZvciBDaGluYS4gWW91IG1pZ2h0IHNheS4gWWVzLCB3ZSBkbyBvZmZlciBhIHBsYW4sIHRoYXQgd29ya3MgaW4gQ2hpbmEuIFdlIGFyZSBhbHNvIHJ1bm5pbmcsIGEgZmlmdHkgcGVyY2VudCBkaXNjb3VudCwgZm9yIG91ciBmaXJzdCBmaXZlIGh1bmRyZWQgdGhvdXNhbmQgdHJhdmVsbGVycy4gSWYgeW91IHdvdWxkIGxpa2UsIEkgY2FuIGNoZWNrIHRoYXQgb3VyIHNlcnZpY2UgZml0cyB5b3VyIHRyaXAsIGFuZCBndWlkZSB5b3UgdG8gdGhlIGJlc3Qgb3B0aW9uLiBKdXN0IHNoYXJlIHlvdXIgdHJhdmVsIGRldGFpbHMuIE5vdGljZSB3aGF0IHRoYXQgZG9lcy4gSXQgYW5zd2Vycy4gSXQgaG9va3MuIEFuZCBpdCBvcGVucyBkaXNjb3ZlcnkuIFN0YWdlIHRocmVlLiBEaXNjb3ZlcnkuIEJlZm9yZSB5b3UgcmVjb21tZW5kIGFueXRoaW5nLCB1bmRlcnN0YW5kIHRoZWlyIG5lZWRzLiBBc2sgYWJvdXQgZGVzdGluYXRpb24uIFRyYXZlbCBkYXRlcy4gRGV2aWNlIGNvbXBhdGliaWxpdHkuIEFuZCBob3cgdGhleSBwbGFuLCB0byB1c2UgdGhlIGRhdGEuIEJ1dCBhc2ssIG9uZSBvciB0d28gcXVlc3Rpb25zLCBhdCBhIHRpbWUuIE5ldmVyIGEgbG9uZyBsaXN0LiBQZXJzb25hbGlzZSwgYmFzZWQgb24gdGhlaXIgYW5zd2Vycy4gQW5kIG5ldmVyLCBldmVyLCBzb3VuZCBsaWtlIGEgZm9ybS4=",
    "Tm93LCB0aGUgc2Vjb25kIGhhbGYuIFN0YWdlIGZvdXIuIFJlY29tbWVuZCB0aGUgYmVzdCBwbGFuLiBHdWlkZSB0aGVtLCB0byB0aGUgbW9zdCBzdWl0YWJsZSBvcHRpb24uIEFuZCBzaG93IHRoZW0sIHlvdSB1bmRlcnN0b29kLiBCYXNlZCBvbiB5b3VyIHRyaXAsIG91ciBKYXBhbiwgc2V2ZW4gZGF5LCB1bmxpbWl0ZWQgZGF0YSBwbGFuLCB3b3VsZCBiZSBhIGdyZWF0IGZpdC4gVGhhdCB0aWVzIHRoZSBwbGFuLCB0byB0aGVpciBvd24gd29yZHMuIEZvY3VzIG9uIG9uZSwgb3IgdHdvIHJlY29tbWVuZGF0aW9ucy4gTmV2ZXIgYSBtZW51LiBTdGFnZSBmaXZlLiBSZWFzc3VyZS4gSWYgdGhleSBoZXNpdGF0ZSwgYnJpZWZseSBleHBsYWluIHRoZSBiZW5lZml0cy4gSW5zdGFudCBkZWxpdmVyeS4gTm8gcGh5c2ljYWwgU0lNIHJlcXVpcmVkLiBFYXN5IGluc3RhbGxhdGlvbi4gQW5kIHR3ZW50eSBmb3VyLCBzZXZlbiwgbGl2ZSBjaGF0IHN1cHBvcnQuIFN0YWdlIHNpeC4gR3VpZGUgdGhlbSwgdG8gcHVyY2hhc2UuIE1ha2UgdGhlIG5leHQgc3RlcCwgc2ltcGxlLiBEb3dubG9hZCB0aGUgSG9saWRheSBkb3QgY29tIGFwcC4gU2lnbiB1cC4gU2VsZWN0IHRoZSBkZXN0aW5hdGlvbi4gQW5kIGNob29zZSB0aGUgZHVyYXRpb24uIFRoZW4gZW50ZXIgcGF5bWVudCwgYW5kIGNvbXBsZXRlIGNoZWNrb3V0LiBBbmQgaGVyZSwgYSBjcml0aWNhbCBkZXRhaWwuIFRoZXkgaGF2ZSB0aHJlZSBodW5kcmVkIGFuZCBzaXh0eSBmaXZlIGRheXMsIHRvIGluc3RhbGwsIGFuZCBhY3RpdmF0ZS4gVG8gYXZvaWQgZWFybHkgYWN0aXZhdGlvbiwgdGhleSBzaG91bGQgb25seSB0YXAsIHR1cm4gb24gZVNJTSwgYWZ0ZXIgdGhleSBhcnJpdmUuIFNheSB0aGF0IGNsZWFybHkuIEl0IHByZXZlbnRzLCBhIHZlcnkgY29tbW9uIG1pc3Rha2UuIFN0YWdlIHNldmVuLiBPZmZlciBmdXJ0aGVyIGFzc2lzdGFuY2UuIFJlbWluZCB0aGVtLCBzdXBwb3J0IGlzIGFsd2F5cyBoZXJlLiBBbmQgc3RhZ2UgZWlnaHQuIENsb3NlIHdhcm1seS4gSW4gdGhlIG1lYW50aW1lLCBpcyB0aGVyZSBhbnl0aGluZyBlbHNlLCBJIGNhbiBoZWxwIHdpdGguIExlYXZlIHRoZW0sIHdpdGggYSBnb29kIGltcHJlc3Npb24uIEV2ZXJ5IHRpbWUu",
    "TGV0J3MgbG9jayB0aGF0IGZsb3cgaW4uIE9uIHlvdXIgc2NyZWVuLCB5b3Ugd2lsbCBzZWUgdGhlIHN0YWdlcywgb2YgYSBwcmVzYWxlIGNoYXQuIEJ1dCB0aGV5IGFyZSBzaHVmZmxlZC4gT3V0IG9mIG9yZGVyLiBZb3VyIGpvYiwgaXMgc2ltcGxlLiBQdXQgdGhlbSBiYWNrLCBpbnRvIHRoZSBjb3JyZWN0IHNlcXVlbmNlLiBGcm9tIHRoZSB2ZXJ5IGZpcnN0IGhlbGxvLiBUbyB0aGUgZmluYWwsIHdhcm0gY2xvc2UuIFRhcCBhIHN0YWdlLiBUaGVuIHRhcCB0aGUgc2xvdCwgd2hlcmUgaXQgYmVsb25ncy4gSWYgeW91IHBsYWNlIG9uZSB3cm9uZywgaXQgd2lsbCBnZW50bHkgc2hha2UuIEp1c3QgdHJ5IGFnYWluLiBUaGVyZSBpcyBubyB0aW1lci4gQW5kIG5vIHByZXNzdXJlLiBJZiB5b3UgbmVlZCBtb3JlIHRpbWUgdG8gdGhpbmssIHBhdXNlIHRoZSBuYXJyYXRpb24sIG9uIHRoZSByaWdodCBzaWRlLiBUaGVuIHJlc3VtZSwgd2hlbmV2ZXIgeW91IGFyZSByZWFkeS4gQXMgeW91IG9yZGVyIHRoZW0sIHNheSBlYWNoIHN0YWdlLCBvdXQgbG91ZC4gR3JlZXQuIEhvb2suIEFzay4gUmVjb21tZW5kLiBSZWFzc3VyZS4gR3VpZGUuIFN1cHBvcnQuIENsb3NlLiBXaGVuIGFsbCBlaWdodCwgYXJlIGluIHBsYWNlLCB3ZSB3aWxsIG1vdmUgb24sIHRvZ2V0aGVyLg==",
    "Tm93IHdlIGdvIGRlZXBlci4gSW50byB0aGUgbWluZHNldCwgdW5kZXJuZWF0aCB0aGUgZmxvdy4gT3VyIHdob2xlIHN0cmF0ZWd5LCByZXN0cyBvbiBvbmUgcHJpbmNpcGxlLiBDdXN0b21lciBlZHVjYXRpb24sIGJlYXRzIHBlcnN1YXNpb24uIFdlIGRvIG5vdCwganVzdCBzZWxsIGRhdGEgYnVuZGxlcy4gV2UgdW5kZXJzdGFuZCwgdGhlIGN1c3RvbWVyJ3Mgd2hvbGUgc2l0dWF0aW9uLiBUaGVuIHdlIG1hcCwgdGhlaXIgdHJhdmVsIGZydXN0cmF0aW9ucywgdG8gb3VyIGZlYXR1cmVzLiBUaGUgZ29hbCwgaXMgbm90IHRvIGNvbnZpbmNlLiBJdCBpcyB0byBzaG93IHRoZW0sIGhvdyB3ZSBzb2x2ZSwgdGhlaXIgZXhhY3QgcGFpbi4gTGV0IG1lIGdpdmUgeW91LCBmb3VyIHBhaXJpbmdzLiBQYWluIG9uZS4gV2FzdGluZyBtb25leSwgb24gZml4ZWQgYnVuZGxlcy4gU29sdXRpb24uIEZsZXhpYmlsaXR5LiBPdXIgcGF5IHBlciBkYXkgb3B0aW9uLCBsZXRzIHRoZW0gcGF5LCBmb3IgdGhlIGV4YWN0IGRheXMsIHRoZXkgbmVlZC4gUGFpbiB0d28uIFRoZSBoYXNzbGUsIG9mIGEgbmV3IFFSIGNvZGUsIGV2ZXJ5IHRyaXAuIFNvbHV0aW9uLiBQZXJtYW5lbmNlLiBPbmUgZVNJTSwgZm9yIGxpZmUuIE9uZSBpbnN0YWxsLiBPbmUgaHVuZHJlZCBhbmQgZmlmdHkgcGx1cyBkZXN0aW5hdGlvbnMuIEZvcmV2ZXIuIFBhaW4gdGhyZWUuIExvc2luZyBhY2Nlc3MsIHRvIHRoZWlyIGhvbWUgbnVtYmVyLiBTb2x1dGlvbi4gWmVybyBpbnRlcnJ1cHRpb24uIE91ciBlU0lNIHJ1bnMsIGFsb25nc2lkZSB0aGVpciBwaHlzaWNhbCBTSU0uIFNvIHRoZWlyIG1lc3NhZ2luZywgYW5kIHRoZWlyIHR3byBmYWN0b3IgY29kZXMsIGtlZXAgd29ya2luZy4gQW5kIHBhaW4gZm91ci4gVW5jZXJ0YWludHksIGFib3V0IHdoZW4gdG8gYWN0aXZhdGUuIFNvbHV0aW9uLiBSaXNrIGZyZWUgcGxhbm5pbmcuIFRoZSB0aHJlZSBodW5kcmVkIGFuZCBzaXh0eSBmaXZlIGRheSwgYWN0aXZhdGlvbiB3aW5kb3cuIEJ1eSBub3cuIEFjdGl2YXRlLCBvbmx5IHdoZW4gdGhleSB0cmF2ZWwuIFNlZSB0aGUgcGF0dGVybi4gWW91IGFyZSBub3QgcHVzaGluZyBhIHByb2R1Y3QuIFlvdSBhcmUgaGFuZGluZyB0aGVtLCBhIHNvbHV0aW9uLiBUbyBhIHByb2JsZW0sIHRoZXkgYWxyZWFkeSBmZWVsLiBUaGF0LiBJcyB2YWx1ZSBmaXJzdCBzZWxsaW5nLg==",
    "SGVyZSBpcyB0aGUgZnJhbWV3b3JrLCB0aGF0IHRpZXMgaXQgYWxsIHRvZ2V0aGVyLiBQLkEuWS5TLiBGb3VyIGxldHRlcnMuIFAuIEEuIFkuIFMuIEl0IGhlbHBzIHlvdSwgY29udHJvbCB0aGUgY29udmVyc2F0aW9uLCBhbmQgY3JlYXRlIHVyZ2VuY3kuIFdpdGhvdXQgc291bmRpbmcsIGxpa2UgYSBzY3JpcHQuIFAuIFByb2ZpbGUuIElkZW50aWZ5IHRoZSBwYWluIHBvaW50LiBHZXQgdG8gdGhlIHJvb3Qgb2YgdGhlaXIgbmVlZCwgaW4gdHdvLCBvciB0aHJlZSBtZXNzYWdlcy4gQXNrIGEgZGlyZWN0IHF1ZXN0aW9uLiBXaGF0IHdhcyB0aGUgbW9zdCBmcnVzdHJhdGluZyBwYXJ0LCBvZiBnZXR0aW5nIG9ubGluZSwgb24geW91ciBsYXN0IHRyaXAuIFRoZW4gbGlzdGVuLiBUbyB0aGUgYW5zd2VyLiBBLiBBc3Nlc3MsIGFuZCBhcnRpY3VsYXRlIHZhbHVlLiBUaGUgbW9tZW50IHRoZXkgbmFtZSBhIHBhaW4sIHByZXNlbnQgdGhlIG9uZSBmZWF0dXJlLCB0aGF0IHNvbHZlcyBpdC4gSW5zdGFudGx5LiBMZWFkLCB3aXRoIHRoZSBzb2x1dGlvbi4gWS4gWWllbGQgaW5jZW50aXZlcy4gTm93LCBjcmVhdGUgdXJnZW5jeS4gRHJvcCB0aGUgaGlnaCBpbXBhY3Qgb2ZmZXIuIFJlbWVtYmVyLCB0aGUgZmlmdHkgcGVyY2VudCBvZmYsIG9uIGEgZmlyc3QgcHVyY2hhc2UsIGlzIHN0cmljdGx5IGxpbWl0ZWQsIHRvIG91ciBmaXJzdCBmaXZlIGh1bmRyZWQgdGhvdXNhbmQgdHJhdmVsbGVycy4gUy4gU2VjdXJlIGNvbW1pdG1lbnQuIENvbmZpcm0gdGhlIGJlbmVmaXQgd29ya3MsIGZvciB0aGVtLiBTbywgZ2V0dGluZyB0aGUgZXhhY3QgZGF5cyB5b3UgbmVlZCwgd29ya3MgZm9yIHlvdS4gVGhlbiwgdXNlIHRoYXQgbGltaXRlZCBkaXNjb3VudCwgdG8gZ3VpZGUgYSB3YXJtIGNsb3NlLiBQcm9maWxlLiBBc3Nlc3MuIFlpZWxkLiBTZWN1cmUuIFAuQS5ZLlMuIFRoZSBiZWF1dHksIGlzIGluIHRoZSBvcmRlci4gWW91IGVhcm4gdGhlIHJpZ2h0LCB0byBjcmVhdGUgdXJnZW5jeS4gQnkgdW5kZXJzdGFuZGluZyB0aGVtLCBmaXJzdC4gVXJnZW5jeSwgd2l0aG91dCB1bmRlcnN0YW5kaW5nLCBmZWVscyBsaWtlIHByZXNzdXJlLiBVcmdlbmN5LCBhZnRlciB1bmRlcnN0YW5kaW5nLCBmZWVscyBsaWtlIGEgZnJpZW5kLCBsb29raW5nIG91dCBmb3IgeW91LiBTYW1lIHdvcmRzLiBBIGNvbXBsZXRlbHkgZGlmZmVyZW50IGZlZWxpbmcuIEFsd2F5cy4gUHJvZmlsZSBmaXJzdC4=",
    "Tm93LiBUaGUgYXJ0LCBvZiB0aGUgY2FsbCB0byBhY3Rpb24uIFdoZW4uIEFuZCBob3cuIFRvIGRyb3AgaXQuIEEgZ29vZCBDLlQuQS4sIHNob3VsZCBuZXZlciBmZWVsLCBsaWtlIGFuIGludGVycnVwdGlvbi4gSXQgc2hvdWxkIGZlZWwsIGxpa2UgdGhlIG5hdHVyYWwgbmV4dCBzdGVwLiBUbyBnZXQgdGhpcyByaWdodCwgZGVwbG95IHlvdXIgc3Ryb25nZXN0IEMuVC5BLnMsIGF0IHR3byBwaXZvdHMsIGluIHRoZSBjb252ZXJzYXRpb24uIFBpdm90IG9uZS4gUmlnaHQgYWZ0ZXIgdmFsdWUuIEp1c3QgYWZ0ZXIgdGhlIEEsIGluIFAuQS5ZLlMuIFlvdSBoYXZlIG1hdGNoZWQgdGhlaXIgcGFpbiwgdG8gb3VyIGZlYXR1cmUuIFRoYXQsIGlzIHRoZSBhaGEgbW9tZW50LiBDYXBpdGFsaXNlIG9uIGl0LiBZb3UgbWlnaHQgc2F5LiBUaGF0IGhhc3NsZSwgaXMgZ29uZSwgd2l0aCBIb2xpZGF5IGRvdCBjb20uIFlvdSBjYW4gaW5zdGFsbCB5b3VyIHBlcm1hbmVudCBwcm9maWxlIG5vdywgc28geW91IG5ldmVyIGRvd25sb2FkLCBhbm90aGVyIFFSIGNvZGUsIGFnYWluLiBQaXZvdCB0d28uIFJpZ2h0IGFmdGVyIHRoZSBpbmNlbnRpdmUuIEp1c3QgYWZ0ZXIgdGhlIFksIGluIFAuQS5ZLlMuIFlvdSBoYXZlIG1lbnRpb25lZCwgdGhlIGZpZnR5IHBlcmNlbnQgb2ZmZXIuIE5vdywgZ2VudGx5LCB1c2UgRi5PLk0uTy4gVGhlIGZpZnR5IHBlcmNlbnQgZGVhbCwgZW5kcywgYXQgZml2ZSBodW5kcmVkIHRob3VzYW5kIHRyYXZlbGxlcnMuIEFuZCB3ZSBhcmUgbmVhcmluZyB0aGUgbGltaXQuIENvbmZpZ3VyZSB5b3VyIGRheXMgbm93LCB0byBsb2NrIGluIHRoZSBkaXNjb3VudCwgYmVmb3JlIGl0IGlzIGdvbmUuIFR3byBwaXZvdHMuIFBvc3QgdmFsdWUuIEFuZCBwb3N0IGluY2VudGl2ZS4gQW5kIG9uZSB3YXJuaW5nLCBmcm9tIHRoZSBnZW5lc2lzIHNlc3Npb24uIEYuTy5NLk8uIG11c3QgYWx3YXlzLCBiZSB0cnVlLiBSZWFsIGxpbWl0cy4gUmVhbCBsZWFkIHRpbWVzLiBOZXZlciwgYSBmYWtlIGNvdW50ZG93bi4gSG9uZXN0IHVyZ2VuY3ksIGNvbnZlcnRzLiBGYWtlIHVyZ2VuY3ksIGRlc3Ryb3lzIHRydXN0LiBVc2UgaXQuIFdpdGggY2FyZS4=",
    "Tm90IGV2ZXJ5IHByZXNhbGUsIGhhcHBlbnMgbGl2ZS4gU29tZXRpbWVzLCBhIGN1c3RvbWVyIGFza3MgYWJvdXQgb3VyIGVTSU0sIHRoZW4gZGlzY29ubmVjdHMsIGJlZm9yZSBwdXJjaGFzaW5nLiBTb21ldGltZXMsIHRoZXkgcmVhY2ggdXMsIGJ5IGVtYWlsIHRpY2tldC4gVGhhdCwgaXMgYSBwcmVzYWxlIHRpY2tldC4gQW5kIHlvdXIgcm9sZSwgaXMgdGhlIHNhbWUuIEJ1aWxkIG9uIHdoYXQgeW91IGFscmVhZHkgdW5kZXJzdG9vZC4gUmVjb21tZW5kIHRoZSByaWdodCBwbGFuLiBBbmQgZm9sbG93IHVwLiBUaHJvdWdoIGEgc3RydWN0dXJlZCwgdHdvIHRvdWNoIHNlcXVlbmNlLiBIZXJlIGlzIHRoZSBzZXF1ZW5jZS4gQW5kIHRoZSBtYWNyb3MsIGFyZSBsaW5rZWQsIHJpZ2h0IG9uIHRoaXMgc2xpZGUuIEZpcnN0IGZvbGxvdyB1cC4gVGhpcnR5IG1pbnV0ZXMsIHRvIG9uZSBob3VyIGxhdGVyLiBTZW5kLCBwcmVzYWxlIGZvbGxvdyB1cCBvbmUuIEluaXRpYWwgY29udGFjdC4gU3VtbWFyaXNlIHRoZWlyIG5lZWQuIFJlY29tbWVuZCBhIHNwZWNpZmljIHBsYW4uIEFuZCBtZW50aW9uLCB0aGUgc2l4IG1vbnRoIHJlZnVuZCBydWxlLiBTZWNvbmQgZm9sbG93IHVwLiBPbiBkYXkgdGhyZWUuIFNlbmQsIHByZXNhbGUgZm9sbG93IHVwIHR3by4gVGhlIHRoaXJkIGRheSBjaGVjayBpbi4gT2ZmZXIgbW9yZSBoZWxwLiBBbmQgaW5jbHVkZSBhIHVzZWZ1bCByZXNvdXJjZS4gTGlrZSBhIHNpeHR5IHNlY29uZCBzZXR1cCBndWlkZS4gRmluYWwgZm9sbG93IHVwLiBPbiBkYXkgc2V2ZW4uIElmIHRoZXkgbm93IGhhdmUgYW4gYWNjb3VudCwgc2VuZCB0aGUgd2l0aCBhY2NvdW50IHZlcnNpb24uIElmIHRoZXkgZG8gbm90LCBzZW5kIHRoZSBubyBhY2NvdW50IHZlcnNpb24uIFdpdGggYSBsaW5rLCB0byBvdXIgcHJpdmFjeSBwb2xpY3kuIEVpdGhlciB3YXksIHRoaXMgaXMgdGhlIGxhc3QgdG91Y2guIEFuZCBvbmUgbW9yZSB0aGluZy4gRGF0YSBjb21wbGlhbmNlLiBJZiBhIGN1c3RvbWVyIGRlY2xpbmVzIGNvbnNlbnQsIG9yIGRvZXMgbm90IHB1cmNoYXNlLCBieSBkYXkgc2V2ZW4uIERlbGV0ZSB0aGVpciBpbmZvcm1hdGlvbi4gVGhhdCwgaXMgbm90IG9wdGlvbmFsLiBBbmQgZm9yIHRoZSBzYWxlcyBvcHBvcnR1bml0eSB0aWNrZXQgZmllbGQsIGNoZWNrIHRoZSB1cGRhdGVkIGRlZmluaXRpb25zLCBvbiB0aGUgV2lraSB0aWNrZXQgZmllbGRzIHBhZ2UuIEFsc28gbGlua2VkLCBoZXJlLg==",
    "VGhhdC4gSXMgdGhlIHByZXNhbGUgY2hhdCwgYW5kIHRpY2tldCBmbG93LiBZb3Ugbm93IGhhdmUgdGhlIHBhdGguIFRoZSBmZWF0dXJlcy4gVGhlIGZyYW1ld29yay4gQW5kIHRoZSBwaXZvdHMuIEJlZm9yZSB5b3UgZ28sIGEgZmV3IG5leHQgc3RlcHMuIEZvciB0aGUgbW9zdCBjdXJyZW50IGluZm9ybWF0aW9uLCBhbHdheXMgY2hlY2ssIHRoZSBQLlEuUi5BLiBjaGFubmVsLiBBbmQgdGhlIG9mZmljaWFsIEhvbGlkYXkgV2lraS4gQm90aCwgYXJlIGxpbmtlZCwgb24gdGhpcyBzbGlkZS4gVGhpbmdzIGNoYW5nZS4gU3RheSBjdXJyZW50LiBXaGVuIHlvdSBhcmUgcmVhZHksIHBsZWFzZSBjb25maXJtIHlvdXIgYWNrbm93bGVkZ2VtZW50LCB1c2luZyB0aGUgZm9ybSwgbGlua2VkIGhlcmUuIFRoYXQgdGVsbHMgeW91ciBzaGlmdCBtYW5hZ2VyLCB5b3UgaGF2ZSBjb21wbGV0ZWQgdGhpcyBzZXNzaW9uLiBBbmQgaWYgYW55dGhpbmcsIHdhcyB1bmNsZWFyLiBPciB5b3UgaGl0IGEgc2NlbmFyaW8sIHRoaXMgZGVjayBkaWQgbm90IGNvdmVyLiBSZWFjaCBvdXQuIFRvIHlvdXIgc2hpZnQgbWFuYWdlci4gT3IgdGhlIGxlYXJuaW5nIGFuZCBjdWx0dXJlIHRlYW0uIFdlIHdvdWxkIG11Y2ggcmF0aGVyLCB5b3UgYXNrLiBUaGFuIGd1ZXNzLiBTaGlmdCBtYW5hZ2Vycy4gVGhpcyBmbG93LCBpcyB5b3VyIGNvYWNoaW5nIGJhc2VsaW5lLiBIb2xkIGV2ZXJ5IHRyYW5zY3JpcHQsIGFnYWluc3QgaXQuIFRoYW5rIHlvdSwgdGVhbS4gVGhlIGZsb3cuIElzIHlvdXJzIG5vdy4gR28uIEFuZCBndWlkZSB5b3VyIG5leHQgdHJhdmVsbGVyLiBBbGwgdGhlIHdheS4gSG9tZS4=",
    "T25lIGxhc3QgdGhpbmcuIEJlZm9yZSB5b3UgZ28uIExldCdzIHB1dCBpdCwgaW50byBhY3Rpb24uIE9uIHRoZSBzY3JlZW4sIHRocmVlIHNob3J0IGNvbW1pdG1lbnRzLiBPbmUuIFRoZSBmaXJzdCBkaXNjb3ZlcnkgcXVlc3Rpb24sIHlvdSB3aWxsIGFzaywgb24geW91ciBuZXh0IHByZXNhbGUgY2hhdC4gVHdvLiBUaGUgb25lIGZlYXR1cmUsIHlvdSB3aWxsIGxlYWQgd2l0aCwgZm9yIGEgbmVydm91cywgZmlyc3QgdGltZSB0cmF2ZWxsZXIuIEFuZCB0aHJlZS4gVGhlIHByZXNhbGUgcGVlciwgeW91IHdpbGwgdHJhZGUgdHJhbnNjcmlwdHMgd2l0aCwgdGhpcyB3ZWVrLiBUeXBlIGVhY2ggb25lIGluLiBXaGVuIHlvdSBhcmUgaGFwcHksIGNsaWNrLCBzYXZlIG15IHBsZWRnZS4gWW91IGNhbiBhbHNvIHByaW50IGl0LiBBbmQgc3RpY2sgaXQsIG5leHQgdG8geW91ciBtb25pdG9yLiBXcml0aW5nIGEgY29tbWl0bWVudCBkb3duLCBtYWtlcyBpdCBmYXIgbW9yZSBsaWtlbHksIHlvdSBhY3R1YWxseSBkbyBpdC4gVGhhdCwgaXMgdGhlIHNjaWVuY2UuIFNvIG1ha2UgdGhlc2UgcmVhbC4gVGhhbmsgeW91LCB0ZWFtLiBUaGUgdGhyZXNob2xkLiBJcyB5b3VycywgdG8gY3Jvc3Mu"
  ];
  function _dec(b) {
    const bin = atob(b);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(u8);
  }
  // Lazy decoded cache — never assigned to a global, never inserted into DOM.
  const SCRIPTS = new Proxy({}, {
    get(_, k) {
      const i = +k;
      if (Number.isNaN(i)) {
        if (k === 'length') return _S.length;
        return undefined;
      }
      return _dec(_S[i] || '');
    }
  });

  const synth = window.speechSynthesis;
  if (!synth) {
    console.warn('SpeechSynthesis not supported');
  }

  // State — locked to American English voice @ 0.90x, captions off, auto-advance on
  const LOCKED_RATE = 0.90;
  const state = {
    voice: null,
    rate: LOCKED_RATE,
    pitch: 1.0,
    autoAdvance: true,
    playing: false,
    currentUtter: null,
    currentIdx: 0,
    completed: false,
    captionsOn: true,
    voiceLabel: 'American English',
  };

  function pickLockedVoice(voices) {
    // Prefer Google's US English (Chrome's stock en-US voice — feminine-leaning).
    let v = voices.find(v => v.name === 'Google US English');
    if (v) return v;
    // Microsoft / Edge premium natural-sounding US female voices.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /(aria|jenny|ava|nova|sara|emma)/i.test(v.name));
    if (v) return v;
    // Apple / macOS US English female voices (Samantha is the default Siri).
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /(samantha|allison|susan|victoria|karen|kathy|veena|female)/i.test(v.name));
    if (v) return v;
    // Any explicitly-female en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /female/i.test(v.name));
    if (v) return v;
    // Any Google en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang) && /google/i.test(v.name));
    if (v) return v;
    // Any en-US voice.
    v = voices.find(v => /^en[-_]US/i.test(v.lang));
    if (v) return v;
    // Last resort: any English voice.
    return voices.find(v => /^en[-_]/i.test(v.lang)) || voices[0] || null;
  }

  function loadVoices() {
    return new Promise(resolve => {
      let voices = synth.getVoices();
      if (voices && voices.length) return resolve(voices);
      synth.addEventListener('voiceschanged', () => {
        resolve(synth.getVoices());
      }, { once: true });
      // Fallback
      setTimeout(() => resolve(synth.getVoices() || []), 1200);
    });
  }

  // Speak helpers
  function stop() {
    state.playing = false;
    if (synth) synth.cancel();
    state.currentUtter = null;
    renderControls();
    setCaption('');
  }

  function speak(idx, opts = {}) {
    if (!synth) return;
    synth.cancel();
    const text = SCRIPTS[idx] || '';
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    if (state.voice) u.voice = state.voice;
    u.rate = state.rate;
    u.pitch = state.pitch;
    u.lang = (state.voice && state.voice.lang) || 'en-US';

    state.currentUtter = u;
    state.currentIdx = idx;
    state.playing = true;
    state.completed = false;
    setCaption(text);
    updateReplayMode();

    // Highlight sentences as they're spoken
    const sentences = splitSentences(text);
    let lastSentenceIdx = -1;
    u.onboundary = (ev) => {
      // ev.charIndex is the char index in u.text
      const ci = ev.charIndex || 0;
      let acc = 0;
      for (let i = 0; i < sentences.length; i++) {
        acc += sentences[i].length;
        if (ci < acc) {
          if (i !== lastSentenceIdx) {
            lastSentenceIdx = i;
            highlightSentence(i);
          }
          break;
        }
      }
    };
    u.onend = () => {
      if (state.currentUtter !== u) return; // superseded
      state.playing = false;
      state.currentUtter = null;
      state.completed = true;
      renderControls();
      updateReplayMode();
      // Auto-advance disabled. User clicks the morphed Refresh→Next button
      // (or, on activity slides, the activity's own Proceed button) to move on.
    };
    u.onerror = () => {
      state.playing = false;
      state.currentUtter = null;
      renderControls();
    };
    synth.speak(u);
    renderControls();
  }

  function splitSentences(text) {
    // Keep terminators with the sentence; split on sentence-end punctuation
    const parts = text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [text];
    return parts;
  }

  // UI ------------------------------------------------------------
  let uiRoot = null;
  let captionEl = null;

  function buildUI(voices) {
    state.voice = pickLockedVoice(voices);
    const resolvedName = state.voice ? state.voice.name : '(no voice available)';
    const resolvedLang = state.voice ? state.voice.lang : '';
    const exactMatch = state.voice && state.voice.name === 'Google US English';

    const root = document.createElement('div');
    root.id = 'narration-bar';
    root.innerHTML = `
      <button class="nb-btn nb-home" data-act="home" title="Go back to the beginning" aria-label="Go back to beginning of deck">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 6h2v12H6zM19 6 9 12l10 6z" fill="currentColor"/></svg>
      </button>
      <button class="nb-btn nb-back" data-act="back" title="Previous slide" aria-label="Previous slide">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
      </button>
      <button class="nb-btn nb-play" data-act="play" title="Play / Pause narration" aria-label="Play or pause narration">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
      </button>
      <button class="nb-btn nb-replay" data-act="replay" title="Restart this slide" aria-label="Restart current slide narration">
        <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>
      </button>
    `;
    document.body.appendChild(root);
    uiRoot = root;
    captionEl = null;
    // Suppress fallback-voice indicator since chrome is hidden; quietly log it.
    if (!exactMatch) {
      console.info('[narration] Google US English not installed; using fallback:', resolvedName, resolvedLang);
    }

    root.querySelector('.nb-play').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      togglePlay();
    });
    root.querySelector('.nb-replay').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const btn = e.currentTarget;
      if (btn.classList.contains('is-next')) {
        // Refresh button has morphed into a "next slide" button.
        goNext();
      } else {
        // Restart narration for the current slide from the beginning.
        speak(getActiveIdx());
      }
    });
    root.querySelector('.nb-back').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      goBack();
    });
    root.querySelector('.nb-home').addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      goHome();
    });
    // Update Back button enabled/disabled state.
    updateBackBtnState();
  }

  function getActiveIdx() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return 0;
    return typeof deck.index === 'number' ? deck.index : 0;
  }

  function renderControls() {
    if (!uiRoot) return;
    const btn = uiRoot.querySelector('.nb-play');
    if (state.playing) {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>';
      btn.classList.add('is-playing');
      btn.title = 'Pause narration';
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
      btn.classList.remove('is-playing');
      btn.title = 'Play narration';
    }
  }

  function togglePlay() {
    if (state.playing) {
      stop();
    } else {
      speak(getActiveIdx());
    }
  }

  // Navigate to the previous slide (Back button). Resumes narration there if
  // we were playing; otherwise just navigates silently.
  function goBack() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const idx = getActiveIdx();
    if (idx <= 0) return;
    const target = idx - 1;
    const wasPlaying = state.playing;
    if (synth) synth.cancel();
    state.playing = false;
    state.currentUtter = null;
    if (typeof deck.goTo === 'function') {
      deck.goTo(target);
    } else if (typeof deck.prev === 'function') {
      deck.prev();
    }
    // The slidechange handler will update Back button & captions.
    // Auto-resume narration on the new slide if we were already playing.
    if (wasPlaying) {
      setTimeout(() => speak(target), 120);
    } else {
      renderControls();
      updateBackBtnState();
    }
  }

  function updateBackBtnState() {
    if (!uiRoot) return;
    const atStart = getActiveIdx() <= 0;
    const back = uiRoot.querySelector('.nb-back');
    if (back) {
      back.disabled = atStart;
      back.classList.toggle('is-disabled', atStart);
    }
    const home = uiRoot.querySelector('.nb-home');
    if (home) {
      home.disabled = atStart;
      home.classList.toggle('is-disabled', atStart);
    }
  }

  // Morph the Refresh button into a Next-slide button when narration on the
  // current slide is complete (and we're not already on the last slide).
  function updateReplayMode() {
    if (!uiRoot) return;
    const btn = uiRoot.querySelector('.nb-replay');
    if (!btn) return;
    const deck = document.querySelector('deck-stage');
    const slides = deck ? Array.from(deck.children).filter(el => el.tagName === 'SECTION') : [];
    const idx = getActiveIdx();
    const isLast = idx >= slides.length - 1;
    if (state.completed && !isLast) {
      btn.classList.add('is-next');
      btn.title = 'Proceed to next slide';
      btn.setAttribute('aria-label', 'Proceed to next slide');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M8.59 7.41 10 6l6 6-6 6-1.41-1.41L13.17 12z" fill="currentColor"/></svg>';
    } else {
      btn.classList.remove('is-next');
      btn.title = 'Restart this slide';
      btn.setAttribute('aria-label', 'Restart current slide narration');
      btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/></svg>';
    }
  }

  // Advance to the next slide & start its narration.
  function goNext() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const slides = Array.from(deck.children).filter(el => el.tagName === 'SECTION');
    const idx = getActiveIdx();
    if (idx + 1 >= slides.length) return;
    if (synth) synth.cancel();
    state.playing = false;
    state.currentUtter = null;
    if (typeof deck.goTo === 'function') deck.goTo(idx + 1);
    setTimeout(() => speak(idx + 1), 200);
  }

  // Jump back to the very first slide (Home button).
  function goHome() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;
    const idx = getActiveIdx();
    if (idx <= 0) return;
    const wasPlaying = state.playing;
    if (synth) synth.cancel();
    state.playing = false;
    state.currentUtter = null;
    if (typeof deck.goTo === 'function') {
      deck.goTo(0);
    }
    if (wasPlaying) {
      setTimeout(() => speak(0), 120);
    } else {
      renderControls();
      updateBackBtnState();
    }
  }

  function setCaption(text) {
    if (!captionEl) return;
    if (!text) {
      captionEl.innerHTML = '';
      return;
    }
    const sentences = splitSentences(text);
    captionEl.innerHTML = sentences.map((s, i) =>
      `<span class="nb-sent" data-i="${i}">${s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`
    ).join('');
  }

  function highlightSentence(i) {
    if (!captionEl) return;
    captionEl.querySelectorAll('.nb-sent').forEach(el => el.classList.remove('is-active'));
    const el = captionEl.querySelector(`.nb-sent[data-i="${i}"]`);
    if (el) {
      el.classList.add('is-active');
    }
  }

  // Wire to deck
  function wireDeck() {
    const deck = document.querySelector('deck-stage');
    if (!deck) return;

    // Hide the deck-stage chrome (prev / next / reset / count overlay).
    // The narration bar in the bottom-right is the only on-screen control we want.
    function hideDeckChrome() {
      if (!deck.shadowRoot) return false;
      if (deck.shadowRoot.getElementById('__nb_hide_chrome')) return true;
      const s = document.createElement('style');
      s.id = '__nb_hide_chrome';
      s.textContent = `
        [data-omelette-chrome],
        .overlay,
        .rail,
        .rail-resize,
        .ctxmenu,
        .confirm-backdrop,
        .chrome,
        .controls,
        .nav,
        .toolbar { display: none !important; }
      `;
      deck.shadowRoot.appendChild(s);
      return true;
    }
    if (!hideDeckChrome()) {
      // shadowRoot may not be ready yet; retry on the next frames
      let tries = 0;
      const t = setInterval(() => {
        if (hideDeckChrome() || ++tries > 30) clearInterval(t);
      }, 100);
    }
    const updateSlideNum = (idx) => {
      const el = document.getElementById('nb-slidenum');
      if (el) el.textContent = `Slide ${idx + 1} of ${SCRIPTS.length}`;
    };
    deck.addEventListener('slidechange', (e) => {
      const i = e.detail.index;
      updateSlideNum(i);
      updateBackBtnState();
      state.completed = false;
      updateReplayMode();
      // If we were narrating, switch to new slide's narration
      if (state.playing) {
        speak(i);
      } else {
        // Pre-show caption for the new slide so the speaker can read along
        setCaption(SCRIPTS[i] || '');
      }
    });

    // === Lock navigation: no skipping ahead or back ===
    // Block keyboard nav (left/right/space/pgup/pgdn/home/end/digits) in capture phase.
    const navKeys = new Set([
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar', 'Enter'
    ]);
    window.addEventListener('keydown', (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      // Allow P for play/pause (handled separately) and Esc.
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') return;
      // Block digits 1-9 (deck-stage uses these to jump slides).
      if (/^[0-9]$/.test(e.key) || navKeys.has(e.key)) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
    // Initial caption
    setCaption(SCRIPTS[0] || '');
    updateSlideNum(0);
  }

  // Keyboard shortcut: P to toggle narration
  document.addEventListener('keydown', (e) => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === 'p' || e.key === 'P') {
      e.preventDefault();
      togglePlay();
    }
  });

  // Boot
  (async () => {
    const voices = await loadVoices();
    buildUI(voices);
    // wait one tick for deck-stage to upgrade
    requestAnimationFrame(() => requestAnimationFrame(wireDeck));
    renderControls();
  })();

  // Bridge for activities.js / external scripts to drive narration
  window.__narration = {
    play: () => speak(getActiveIdx()),
    stop: () => stop(),
    toggle: () => togglePlay(),
    isPlaying: () => state.playing,
  };

  // Stop synth on page hide so it doesn't keep babbling
  window.addEventListener('pagehide', stop);
  window.addEventListener('beforeunload', stop);
})();
